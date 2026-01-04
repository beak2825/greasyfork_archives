// ==UserScript==
// @name         warez_helper
// @namespace    http://tampermonkey.net/
// @version      2024-05-19_v1.3.1.1
// @description  Script aidant la collecte de liens de téléchargement ; iframe copié de https://greasyfork.org/fr/scripts/465783-wawacity-dl-protect-direct-download-link
// @author       Cyrilyxe
// @license      MIT

// @match        https://www.wawacity.city/*
// @match        https://www.wawacity.nl/*
// @match        https://www.wawacity.tokyo/*
// @match        https://www.wawacity.*

// @match        https://www.extreme-down.moe/*
// @match        https://www.extreme-down.*

// @match        https://www.zone-telechargement.city/*
// @match        https://www.zone-telechargement.*

// @match        https://dl-protect.link/*

// @match        https://*.darkino*.*/post/*
// @match        https://*.darkino*.*/download/*

// @match        https://catalogue.darkino5.top/post/*
// @match        https://catalogue.darkino5.top/
// @match        https://catalogue.darkino5.top
// @match        https://catalogue.darkino5.top/download/*

// @match        https://www.darkiworld.com/
// @match        https://www.darkiworld.com/titles/*
// @match        https://www.darkiworld.com/download/*

// @include      /^https:\/\/catalogue\.darkino[0-9]+\.top\/post\/.*
// @include      /^https:\/\/catalogue\.darkino[0-9]+\.top\/
// @include      /^https:\/\/catalogue\.darkino[0-9]+\.top
// @include      /^https:\/\/catalogue\.darkino[0-9]+\.top\/download\/.*
// @include      /^https:\/\/.*\.darkino[0-9]+\..*\/download\/.*

// @icon         https://www.google.com/s2/favicons?sz=64&domain=wawacity.city
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @grant        GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/488485/warez_helper.user.js
// @updateURL https://update.greasyfork.org/scripts/488485/warez_helper.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // balise de choses à faire : '# TODO'
    /* penser à trouver les sources responsables des popup
       Exemple : https://rhwvpab.com/script/utils.js
       à ajouter dans les liste personalisée des blocker de pub
    */
    /* FONCTIONNEMENT
       Sur un site de telechargement :
           Produit un tableau avec les liens des proxy ou leur liens qu'ils cachent si la page a déjà été ouverte
       Sur un site qui cache les liens
           Va tenter de decourvrir le lien et ferme la page aussitot
           Si une erreur se produit, la page sera quand même fermée
    */

    //generique ****************************************
    function stored_gbl(variableName, toSet="WAREZ_HELPER_2df65735-7daf-4710-8f7d-3168d27bae56"){ // permet de stocker la dernière modification d'une variable globale
        //console.log("stored_gbl",variableName,toSet)
        let valueToReturn = null;
        if(toSet!="WAREZ_HELPER_2df65735-7daf-4710-8f7d-3168d27bae56"){// set value
            valueToReturn=toSet;
            GM_setValue(variableName,valueToReturn);
        }else{// get value
            valueToReturn=GM_getValue(variableName);
        }
        return valueToReturn;
    }
    function NodeList_to_Array(nodeLst){
        return Array.prototype.slice.call(nodeLst);
    } // OK
    function convert_querySelectorAll_to_array(nodeLst){
        return NodeList_to_Array(nodeLst);
    } // OK

    function removeItem(arrayIn, item, occurences=1){ // fonction qui retire un objet de la liste <occurences> fois
        var index = arrayIn.indexOf(item);
        if(index>=0){
            var x = arrayIn.splice(index, occurences);
        }
        return arrayIn;
    }// ok
    function removeItems(arrayIn, item){ // fonction qui supprime toutes les occurences dans une liste
        var previousLength;
        do{
            previousLength = arrayIn.length;
            arrayIn = removeItem(arrayIn, item);
        }while(arrayIn.length!=previousLength);
        return arrayIn;
    } // ok
    function removeAllItems(arrayIn, items){ // fonction qui supprime toutes les occurences dans une liste de tous les items
        var item, i;
        for(i=0;i<items.length;i++){
            item = items[i]
            arrayIn = removeItems(arrayIn, item)
        }
        return arrayIn;
    } // ok
    function updateClipboard(newClip) {
        navigator.clipboard.writeText(newClip).then(function() {
            /* le presse-papier est correctement paramétré */
            console.log ("clipboard ok");
        }, function() {
            /* l'écriture dans le presse-papier a échoué */
            console.log ("clipboard ok");
        });
    } // OK
    function observeChanging(DOMobject){//https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
        // Select the node that will be observed for mutations
        const targetNode = DOMobject;
        console.log(targetNode)

        // Options for the observer (which mutations to observe)
        const config = { attributes: true, childList: true, subtree: true };
        console.log(config)

        // Callback function to execute when mutations are observed
        const callback = (mutationList, observer) => {
            for (const mutation of mutationList) {
                if (mutation.type === "childList") {
                    console.log("A child node has been added or removed.");
                } else if (mutation.type === "attributes") {
                    console.log(`The ${mutation.attributeName} attribute was modified.`);
                }
            }
        };

        // Create an observer instance linked to the callback function
        const observer = new MutationObserver(callback);

        // Start observing the target node for configured mutations
        observer.observe(targetNode, config);

        // Later, you can stop observing
        observer.disconnect();

    } // non utilisé pour le moment
    function getDivCoveringAll(classes=[]){ // fonction qui retourne une div qui se met au dessus de tout
        let outterDiv = document.createElement("div");
        for(let i=0;i<classes.length;i++){
            outterDiv.classList.add(classes[i]);
        }
        let outterDiv_style={
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            zIndex: "9999",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        };
        Object.assign(outterDiv.style,outterDiv_style);
        return outterDiv;
    }
    function getLoadingDiv(classes=[], optionalText="", maxDiameterInPx=100, thicknest=1, color="orange"){
        const Spinning = [
            { transform: "rotate(360deg) scale(1)" },
        ];
        const SpinningReversed = [
            { transform: "rotate(-360deg) scale(1)" },
        ];
        const Timing = {
            duration: 2000,
            iterations: "Infinity",
        };
        let loadingDiv = document.createElement("div");

        for(let i=0;i<classes.length;i++){
            loadingDiv.classList.add(classes[i]);
        }

        // calcul des dimensions relativement à maxDiameter
        let defafaultDiameter = 100
        let defafaultradius = 10
        let width = parseInt(defafaultDiameter*maxDiameterInPx/100);
        let height = width;
        let borderRadius = parseInt((thicknest<0?0:thicknest)*defafaultradius*maxDiameterInPx/100);

        let loadingDiv_style={
            width: width+"px",
            height: height+"px",
            maxWidth: "100%",
            maxHeight: "100%",
            borderRadius: "50%",
            border: (thicknest<=0?width:borderRadius)+"px solid #ddd",
            borderTopColor: color,
            animation: "loading 1s linear infinite",
        };
        Object.assign(loadingDiv.style,loadingDiv_style);
        loadingDiv.animate(Spinning, Timing);

        if(optionalText!=""){
            let p =document.createElement("p");
            p.innerText = optionalText;
            p.style.textShadow="#000000 1px 1px, #000000 -1px 1px, #000000 -1px -1px, #000000 1px -1px;";
            p.style.color="auto";
            p.animate(SpinningReversed, Timing);
            loadingDiv.appendChild(p)
        }
        return loadingDiv;
    }
    function displayLoadingOvrlayed(optionalText=""){ // fonction qui affiche un cercle de chargement en overlay sur toute la page (https://timonwa.com/blog/simple-css-loading-spinner)
        let outterDiv = getDivCoveringAll(["warez_helper_loading-state"]);

        let loadingDiv = getLoadingDiv(["warez_helper_loading"],optionalText);
        outterDiv.appendChild(loadingDiv);

        let hostElement = document.querySelector("body");
        hostElement.prepend(outterDiv);
        return outterDiv;
    }
    function deleteAnimation(itemToRemove){
        try{
            itemToRemove.remove();
        }catch{}
    }


    function getParentElementFrom(DOM_object){
        let DOM_parent = null;
        try{ // parentElement
            DOM_parent = DOM_object.parentElement;
        }catch{}
        return DOM_parent;
    }
    function getParentNodeFrom(DOM_object){
        let DOM_parent = null;
        try{ // parentElement
            DOM_parent = DOM_object.parentNode;
        }catch{}
        return DOM_parent;
    }
    function getParent(DOM_object){
        // déclaration des variables
        let DOM_parent=null;
        // test ELEMENT
        DOM_parent = getParentElementFrom(DOM_object)
        // test node
        if(DOM_parent==null){DOM_parent = getParentNodeFrom(DOM_object)}
        return DOM_parent;
    }
    function getFirstParent_as(DOM_object, search="div"){ // retourne le premier contenant de type search
        let DOM_parent=getParent(DOM_object);
        if(DOM_parent==null){return DOM_parent;}

        let DOM_parent_type = DOM_parent.nodeName.toLowerCase();
        search = search.toLowerCase();
        if(search == DOM_parent_type){
            return DOM_parent;
        }else{
            return getFirstParent_as(DOM_parent, search);
        }
    }

    function uuidv4() { // https://stackoverflow.com/questions/105034/how-do-i-create-a-guid-uuid
        return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
                                                              (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
                                                             );
    }

    //Work with shadows ********************************
    function recurciveShadows(DOMobject, lst_shadows=[]){ // fonction qui retourne les shadows (equivalent de iframe ou d'objet dans lesquel il faut rentrer)
        var i, children, child, nodeName
        if(DOMobject.shadowRoot){
            //console.log("shadow : ",DOMobject.nodeName, DOMobject);
            lst_shadows.push(DOMobject)
            children = NodeList_to_Array(DOMobject.shadowRoot.host.childNodes);
            if(children.length<=0){children = NodeList_to_Array(DOMobject.shadowRoot.childNodes);}
        }else{
            children = NodeList_to_Array(DOMobject.childNodes);
        }
        for(i=0;i<children.length;i++){
            child = children[i];
            //console.log("test ",child);
            lst_shadows = recurciveShadows(child, lst_shadows); // extend lst_shadows avec le resultat
        }
        return(lst_shadows);
    } // OK

    function className_for_querySelectorAll(className){ // fonction qui transforme une liste de classe en une liste pour queryselectorALl
        className = "."+className;
        className = className.replace(" ", ".");
        className = className.replace("..", ".");
        return className;
    } // ok
    function getElementsByClassName(className, base = document, lst_shadows=[]){ // fonction qui retourne la liste des objets de la classe meme si il y a des shadows
        var i, DOMobject, lst_DOMobjects_inShadow;
        className = className_for_querySelectorAll(className);
        var lst_DOMobjects = NodeList_to_Array(base.querySelectorAll(className));

        for(i=0; i<lst_shadows.length;i++){
            DOMobject = lst_shadows[i].shadowRoot;
            lst_DOMobjects_inShadow = NodeList_to_Array(DOMobject.querySelectorAll(className));
            lst_DOMobjects.push.apply(lst_DOMobjects, lst_DOMobjects_inShadow); // extend la list : https://stackoverflow.com/questions/1374126/how-to-extend-an-existing-javascript-array-with-another-array-without-creating
            // Array.prototype.push.apply(lst_DOMobjects,lst_DOMobjects_inShadow) ; // extend la list : https://stackoverflow.com/questions/1374126/how-to-extend-an-existing-javascript-array-with-another-array-without-creating
        }
        return lst_DOMobjects;
    } // OK

    function listShadowObjects(display=true, DOMobject=null){ // fonction qui retourne la liste des shadows
        if(DOMobject==null) {DOMobject = document.querySelector("body");}
        var lst_shadows = recurciveShadows(DOMobject);
        if(display){console.log(lst_shadows);}
        return lst_shadows;
    } // OK
    //**************************************************

    // fonction pour aider le fit d'une image dans un tableau
        function setTableStyle_forImagePerfectFit(DOM_table, fontSize="100%", height="1em"){
            DOM_table.style.fontSize=fontSize;
            DOM_table.style.height=height;
            return DOM_table
        }
        function getDiv_as_fitImageContainer(){ // retourne une div avec avec le style permettant d'y ajouter une image qui se place parfaitement dedans
            let DOM_div= document.createElement("div");
            DOM_div.style.height="100%"
            DOM_div.style.width="100%"
            DOM_div.style.overflow="hidden"
            DOM_div.style.position="relative"
            return DOM_div
        }
        function setImageStyle_forPerfectFit(DOM_img){
            DOM_img.style.position="absolute";
            DOM_img.style.height="auto";
            DOM_img.style.width="auto";
            DOM_img.style.maxWidth="100%";
            DOM_img.style.maxHeight="100%";
            return DOM_img
        }
        function addAltAttributeTo_Div_as_fitImageContaine(DOM_div){
            try{
                let firstChild = DOM_div.firstChild;
                DOM_div.setAttribute("title",firstChild.getAttribute("alt"));
            }catch{}
            return DOM_div
        }
    function getFontSize_options(){
        let dictOptions={
            keywords:["xx-small", "x-small", "small", "medium", "large", "x-large", "xx-large", "xxx-large"],
            keywords_relative:["larger", "smaller"],
            pixels:["25px","10px"],
            ems:["0,5em","1em","2em"], // em de M etait la taille de la lettre M comme références, dons des M = des ems ; 1em = taille de la police de la page
            percentage:["50%","100%","200%",],
            rems:["0,5rem","1rem","2rem"], // rem values were invented in order to sidestep the compounding problem, rem values are relative to the root html element
            exs:["0,5rem","1rem","2rem"], // Like the em unit, an element's font-size set using the ex unit is computed or dynamic. It behaves in exactly the same way, except that when setting the font-size property using ex units, the font-size equals the x-height of the first available font used on the page
            pts:["25pt","10pt"],
            cms:["1cm"],
            ins:["1in"]
        }
        let toReturn=[];
        let keys=Object.keys(dictOptions);
        for(let i=0;i<keys.length;i++){
            let key = keys[i];
            let arrayToSlice = dictOptions[key];
            let sliceLength=(arrayToSlice.length>=3?3:arrayToSlice.length);
            toReturn = toReturn.concat(arrayToSlice.slice(0,sliceLength));
        }
        return toReturn;
    }
    // FINfonction pour aider le fit d'une image dans un tableau
    //**************************************************
    //Storage (pour une meilleure visibilité  **********
    function getStorageKeyNotToWipe(){// fonction qui retourne la liste des clés du stockage à conserver en cas de remise à zéro
        return ["gbl_defaultLimitLot","gbl_cb_freshStart", "gbl_tableFontSize"]
    }
    function wipeStorage(keepKeyNotToWipe=true){
        let lst_keyNotToWipe = (keepKeyNotToWipe?getStorageKeyNotToWipe():[]); // liste des clés à ne pas supprimer
        let allKeysStored = GM_listValues();
        let allCurrentPageLinks = getCurrentPageLinks_and_OGlinks(); // récupère les liens de la page (originaux et mis à jours)
        let cptClearedKey=0;
        for(let i=0;i<allKeysStored.length;i++){
            let key=allKeysStored[i];
            if(! lst_keyNotToWipe.includes(key) && ! allCurrentPageLinks.includes(key)){ // clé à supprimer
                console.log("[wipeStorage] suppression de'",key,"'du stockage");
                GM_deleteValue(key);
                cptClearedKey++;
            }
        }
        console.log("[wipeStorage] suppression de",cptClearedKey,"clés, il en reste",GM_listValues().length);
    }

    //**************************************************

    // Transformation des liens
    function stored_gbl_defaultLimitLot(toSet=null){ // permet de stocker la dernière modification des lots
        let valueReturned=undefined;
        if(toSet==null){//get
            valueReturned = stored_gbl("gbl_defaultLimitLot")
        }else{
            if(toSet<0){
                toSet=1;
            }
            valueReturned = stored_gbl("gbl_defaultLimitLot", toSet)
        }
        if(valueReturned!= undefined){// la valeur existe et on peut la retoruner
            valueReturned = parseInt(valueReturned);
        }else{
            valueReturned=1;
        }
        return valueReturned;
    }
    var gbl_defaultLimitLot=stored_gbl_defaultLimitLot(); /// CHANGER LE NOMBRE DE LOT PAR DEFAUT
    function get_prefered_lotLimit(){ // fonction a ameliorer si il y a un systeme de preference
        return gbl_defaultLimitLot;
    }
    var gbl_lstDict=[]; // stock tous les liens de la page sous la forme de dict {getLinkKey():link} // améliorable getOGlinkKey():link original,
    var gbl_TableID="warez_helper_output_table";
    var gbl_selectID="warez_helper_output_select";
    var gbl_classLinks="warez_helper_output_link"; // utilisé par getLienFromDict
    var gbl_proxyLinkButtonValuePossible=[
        "Continuer", // DL-PROTECT
        "Voir le lien" // DARKINO DL
    ]; // liste l'ensemble des combinaisons connue de bouton pour afficher un lien proxifié
    function isButtonForAccessingLink(buttonText){ // fonction qui utilise la variable globale gbl_proxyLinkButtonValuePossible qui liste les text de bouttons des proxy permettant d'afficher le lien
        return gbl_proxyLinkButtonValuePossible.includes(buttonText);
    }
    var gbl_showLinkButtonValuePossible=[
        "Télécharger" // DARKINO DL
    ]; // liste l'ensemble des combinaisons connue de bouton pour afficher un lien proxifié
    function isButtonForShowingLink(buttonText){ // fonction qui utilise la variable globale gbl_proxyLinkButtonValuePossible qui liste les text de bouttons des proxy permettant d'afficher le lien
        return gbl_showLinkButtonValuePossible.includes(buttonText);
    }

    function getURLSdelimiter(){return " ";} // fonction qui rertourne le delimiteur entre les urls de telechargment si il y en a plusieurs

    // fonction qui met à jour les liens
    function removeLinkFromStorage(link, autoUpdateLinksInTable = true){
        console.log("[removeLinkFromStorage] tente de supprimer",link);
        let lstSaved = GM_listValues()
        let toDelete = []
        for(let i=0;i<lstSaved.length;i++){
            let key = lstSaved[i]
            if( key == link || GM_getValue(key) == link){
                if(! toDelete.includes(key)){
                    toDelete.push(key);
                }
            }
        }
        for(let j=0;j<toDelete.length;j++){
            let key = toDelete[j];
            console.log("[removeLinkFromStorage] suppresion de",key);
            GM_deleteValue(key);
        }
        if(autoUpdateLinksInTable){updateLinks();}// on met à jour par defaut
    }
    function removeLinkFromStorage_fromEvent(eventTarget){
        try{
            if(eventTarget.hasAttribute("link")){
                removeLinkFromStorage(eventTarget.getAttribute('link'));
            }else{//il s'agit probblement du header et donc de supprimer tous les liens
                //récupération les liens de la vue
                let onlyNotDone = true
                let toClean = getAllLinksDisplayed();
                if(confirm(`Voulez-vous supprimer ces ${toClean.length} liens`)){
                    // boucle de suppression sans mise à jour
                    for(let i=0;i<toClean.length;i++){
                        removeLinkFromStorage(toClean[i],false);
                    }
                    // mise à jour
                    updateLinks();
                }
            }
        }catch{}
    }
    function getCurrentPageLinks_and_OGlinks(){
        let lstLinks=[];
        let linkKey = getLinkKey();
        for(let i=0;i<gbl_lstDict.length;i++){
            let link = gbl_lstDict[i][linkKey];
            let updatedLink = getUpdatedLink(link,true);
            let OGlink = getOGlink(link, false, updatedLink, true);
            // stockage des liens (uniques)
            if(!lstLinks.includes(link)){lstLinks.push(link);}
            if(!lstLinks.includes(updatedLink)){lstLinks.push(updatedLink);}
            if(!lstLinks.includes(OGlink)){lstLinks.push(OGlink);}
        }
        return lstLinks;
    }
    function getOGlink(link, forceRollBack=false, updatedLink="", rollBackIf_updatedLink_empty=false){ // met à jour le lien si updatedLink (rollaback si vide); force le rollback avec forceRollBack
        let allDOMdisplayedLinks = getAllDOMlinksDisplayed();
        for(let i=0;i<allDOMdisplayedLinks.length;i++){
            try{
                let DOM_link=allDOMdisplayedLinks[i];
                if(DOM_link.href==link){
                    let OGlink = DOM_link.getAttribute("linkOG");
                    if(forceRollBack){ // on reprend l'original
                        DOM_link.href=OGlink;
                        DOM_link.innerText = OGlink;
                    }else if(updatedLink!=""){ // on met à jour
                        DOM_link.href=updatedLink;
                        DOM_link.innerText = updatedLink;
                    }else if(updatedLink == "" && rollBackIf_updatedLink_empty){
                        DOM_link.href=OGlink;
                        DOM_link.innerText = OGlink;

                    }
                    return OGlink;
                    break;
                }
            }catch{
                continue;
            }
        }
        return link;
    }
    function updateDOMlink(link){
        let updatedLink = getUpdatedLink(link, true);
        let rollBack=false
        let rollback_if_no_updated = true
        getOGlink(link, rollBack, updatedLink, rollback_if_no_updated);
    }

    function getUpdatedLink(link, emptyIfNotKnow=false){
        try{
            let updatedLink = GM_getValue(link);
            if(updatedLink){
                link = updatedLink;
            }else if(emptyIfNotKnow){
                link=""
            }
        }catch{}
        return link;
    }
    function updateLinks(){
        // récupération du filtre
        let DOMselect, filterOn;
        try{
            DOMselect = document.getElementById(gbl_selectID);
            if(DOMselect==null || ! DOMselect){
                throw new Error('[updateLinks] select non trouvé');
            }
            filterOn = DOMselect.value;
        }catch (error){ // le select n'éxiste pas encore
            console.error('[updateLinks] ERROR',error.message);
            return false;
        }

        // mise à jour des liens depuis le stockage
        let linkKey = getLinkKey();
        for(let i=0;i<gbl_lstDict.length;i++){
            try{
                let link = gbl_lstDict[i][linkKey];
                let updatedLink = getUpdatedLink(link,true);
                let OGlink = getOGlink(link, false, updatedLink, true);

                if(updatedLink==""){
                    //on récupère le lien original
                    updatedLink = OGlink;
                }
                gbl_lstDict[i][linkKey] = updatedLink;
            }catch{
                continue;
            }
        }

        // mise à jour de l'affichage
        updateTable(filterOn)
    }

    // fonction qui ouvre les liens affichés
    /* utilisation d'iframe, il est aussi possible d'utiliser https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage pour communiquer de l'iframe a la fenetre parente */
    var gbl_lst_openedWindows = []; // {link:link, tab:openedWindow} ou {link:link, tab:divContenantIframe}
    function getLinkTabState(link){ // utilise gbl_lst_openedWindows
        let found =false;
        let lst_divIframe = []
        //try {
        //console.log("getLinkTabState", gbl_lst_openedWindows)
        for(let i=0;i<gbl_lst_openedWindows.length;i++){
            //console.log(i,"?",gbl_lst_openedWindows[i],"==",link);
            if(gbl_lst_openedWindows[i]["link"] == link){
                //console.log("getLinkTabState found", gbl_lst_openedWindows[i]["tab"]);
                //console.dir(gbl_lst_openedWindows[i]["tab"]);
                lst_divIframe.push(gbl_lst_openedWindows[i]["tab"]);
                found = true
            }
        }
        if(! found){
            //console.log("getLinkTabState not found")
        }
        return lst_divIframe;
        // }catch{}
    } // utilise gbl_lst_openedWindows
    function removeIframeFromListOpened(domID){ // fonction qui recherche dans gbl_lst_openedWindows [tab] la presence de l'iframe domID
        for(let i=gbl_lst_openedWindows.length-1;i>=0;i--){
            try{
                let DOM_iframe = gbl_lst_openedWindows[i]["tab"]
                if(DOM_iframe.id==domID){ // on la supprime de la liste
                    gbl_lst_openedWindows = gbl_lst_openedWindows.slice(0, i).concat(gbl_lst_openedWindows.slice(i+1))
                    continue
                }
            }catch{continue}
        }
    }
    function clean_gbl_lst_openedWindows(){ // fonction qui verifie les iframes ouvertes et supprime celles qui sont fermées
        console.log("clean_gbl_lst_openedWindows")
        for(let i=gbl_lst_openedWindows.length-1;i>=0;i--){
            try{
                let DOM_iframe = gbl_lst_openedWindows[i]["tab"]
                let iframeID = DOM_iframe.id
                let DOM_iframe_fromID = document.getElementById(iframeID)
                if(DOM_iframe_fromID){ // all good
                }else{// on purge
                    console.log("clean_gbl_lst_openedWindows, suppression de",DOM_iframe)
                    gbl_lst_openedWindows = gbl_lst_openedWindows.slice(0, i).concat(gbl_lst_openedWindows.slice(i+1))
                    continue
                }
            }catch{continue}
        }
        console.log("av maj",gbl_lst_openedWindows)
        updateLinks();
    }
    function errorPrefixe(){
        return "ERROR : "
    }
    function setStorageValueAsError(link, errorMessage){
        GM_setValue(link,`${errorPrefixe()}${errorMessage} (from ${window.location.href})`)
    }
    function isTabClosed(dictOpenedWindow){
        let tabClosed = false;
        try{
            //console.log("verifTabs 1",dictOpenedWindow)
            // figeage des infos
            let copyDictTab = dictOpenedWindow["tab"]
            try{
                let iframeID = copyDictTab.id;
                if(document.getElementById(iframeID)){// iframe ouverte
                }else{// iframe fermée
                    tabClosed=true;
                    removeIframeFromListOpened(iframeID)
                }
            }catch{}
            if(copyDictTab===null || copyDictTab==null){ // l'onglet doit être fermé
                //console.log("verifTabs 1.5",copyDictTab)
                tabClosed=true;
            }
            //console.log("verifTabs 2",copyDictTab, copyDictTab.length)
            tabClosed = (tabClosed?tabClosed:copyDictTab.closed);
            //console.log("verifTabs 3",tabClosed)
        }catch{}
        return tabClosed
    }
    function tabLink(dictOpenedWindow, supposedLink){
        let tabActualLink = supposedLink;
        try{
            //console.log("verifTabs 1",dictOpenedWindow)
            // figeage des infos
            let copyDictTab = dictOpenedWindow["tab"]
            //console.log("verifTabs 2",copyDictTab, copyDictTab.length)
            tabActualLink = copyDictTab.location.href;
            //console.log("verifTabs 4",tabActualLink)
        }catch{}
        return tabActualLink
    }
    async function verifTabs(){ // fonction qui vérifie que les fenetres sont toutes fermées avant de mettre à jour le tableau utilisateur
        let cpt_i = 0;
        let lstIndexToPop =[];
        for(let i=0;i<gbl_lst_openedWindows.length;i++){
            let dictOpenedWindow = gbl_lst_openedWindows[i];
            if(!("link" in dictOpenedWindow && "tab" in dictOpenedWindow)){// il y a un probleme avec de dictionnaire , on le supprime de ceux à verifier
                lstIndexToPop.push(i);
                continue;
            }

            let supposedLink = dictOpenedWindow["link"];
            let tabClosed = isTabClosed(dictOpenedWindow);
            let tabActualLink = tabLink(dictOpenedWindow, supposedLink);

            if(GM_getValue(supposedLink) || tabClosed){
                cpt_i++;
                try{ // tab
                    dictOpenedWindow["tab"].close();
                }catch(error){}

                try{ // iframe
                    //console.log("tentative de fermeture")
                    let DIV_contener = dictOpenedWindow["tab"];
                    DIV_contener.remove();
                }catch{}
            }else{ // vérification qu'il n'y ai pas eut une redirection
                if(tabActualLink!=supposedLink && !tabClosed && tabActualLink!="about:blank"){// probablement une redirection, on KILL l'onglet
                    //console.error("[verifTabs] ERROR redirection:", supposedLink, "=>", tabActualLink);
                    setStorageValueAsError(supposedLink, `redirection vers ${tabActualLink}`); // ca permet de rentrer à la prochaine itteration dans le if GM_getValue(supposedLink)
                }
            }

        }
        if(lstIndexToPop.length>0){// il y a des onglets qui ne sont pas en bon etat, on les supprimes de ceux à monitorer
            for(let j=lstIndexToPop.length-1 ; j>=0;j--){ // on supprime les index en erreur par le plys grand au plus petit
                gbl_lst_openedWindows.splice(lstIndexToPop[j],1);
            }
        }
        //console.log("verif tabs, cpt x length",cpt_i,gbl_lst_openedWindows.length)
        if(cpt_i<gbl_lst_openedWindows.length){
            await new Promise(r => setTimeout(r, 500)); // sleep
            verifTabs();
        }else{
            //console.log("vidage de gbl_lst_openedWindows");
            gbl_lst_openedWindows = [];
            updateLinks();
        }
    }
    let gbl_lstInterval_lots = []
    function stopAllIntervals_lots(){
        try{
            setProgressBarColor("orange");
            let compteur=0;
            while(gbl_lstInterval_lots.length>0 && compteur<100){
                clearInterval(gbl_lstInterval_lots.shift()); // va clear le premier element en meme temps que le supprime de la liste
                ;
                compteur++;
            }
            if(compteur>=100){
                console.log("[stopAllIntervals_lots] arret de la fonction après 100 appels, intervals restant:",gbl_lstInterval_lots)
            }
            setProgressBarColor("red");
        }catch{}
    }
    function updateLinkHS(link){
        //console.log("updateLinkHS", link);
        GM.xmlHttpRequest({
            method: "GET",
            url: link,
            onload: function(response) {
                //console.log(link+" : "+response.status);
                switch(response.status){
                    case 200:
                        break;
                    case 404:
                    case 400:
                    case 500:
                    default:
                        setStorageValueAsError(link, response.status);
                }
                if(response.finalUrl != link){
                    setStorageValueAsError(link, "redirection");
                }
            },
            onerror: function(error) {
                console.log("[updateLinkHS] error pour "+link, error);
            }
        });
    }

			// inspiré de https://greasyfork.org/fr/scripts/465783-wawacity-dl-protect-direct-download-link

				function setDefaultDivIframeSize(DOM_div, DOM_iframe){ // fonction qui détermine le style de l'iframe et sa DIV contenante
					try{
						DOM_div.style.width="500px";
						DOM_div.style.height="500px";
						DOM_div.height="500px";

						DOM_iframe.style.width="100%";
						DOM_iframe.style.height="100%";
					}catch{}
				}
				function setDivFrameSize(DOM_parent, DOM_iframe, toEvaluate="*2",
											minimumWidth=200, minimumHeight=35, // taille minimum pour toujours afficher les boutons
											marginLeft=10, marginTop=5 // marge necessaire pour afficher les boutons en haut de la page
										){
					// déclaration des variables
						let isOverLimit = false

						let boundingClientRect_body = document.body.getBoundingClientRect()
						let maximumWidth = window.innerWidth-boundingClientRect_body.left - marginLeft;
						let maximumHeight = window.innerHeight-boundingClientRect_body.top - marginTop;

						let boundingClientRect_DOM_parent =  DOM_parent.getBoundingClientRect();
						let frameWidth = boundingClientRect_DOM_parent.width;
						let frameHeight = boundingClientRect_DOM_parent.height;

						let evaledNewWidth = eval("parseInt("+frameWidth+toEvaluate+")");
						let evaledNewHeight = eval("parseInt("+frameHeight+toEvaluate+")");


					if((evaledNewWidth<minimumWidth && evaledNewHeight<minimumHeight) || (evaledNewWidth>maximumWidth && evaledNewHeight>maximumHeight)){
						isOverLimit = true;
					}

					// modification de la div parente
						DOM_parent.style.width=(evaledNewWidth<minimumWidth?minimumWidth:(evaledNewWidth>maximumWidth?maximumWidth:evaledNewWidth))+"px";
						DOM_parent.style.height=(evaledNewHeight<minimumHeight?minimumHeight:(evaledNewHeight>maximumHeight?maximumHeight:evaledNewHeight))+"px";
					// modification de l'iframe
						DOM_iframe.style.width="100%";
						DOM_iframe.style.height="100%";

					return isOverLimit;
				}

				function actionOnIframe(DOM_iframe, action="display"){// actions : remove close, display, hide, minimize, restore, reduce, enlarge, refresh
					action = action.toLocaleLowerCase();
					let DOM_parent=getParent(DOM_iframe);
					let DOM_iframe_document = (DOM_iframe.contentWindow || DOM_iframe.contentDocument);
					/*
					console.log("DOM_iframe", DOM_iframe);
					console.dir(DOM_iframe);
					console.log("DOM_iframe_document", DOM_iframe_document);
					console.dir(DOM_iframe_document);
					console.log(action);
					*/
					/*
						console.dir(DOM_iframe.contentWindow);//.location.reload();
							DOM_iframe.contentWindow.blur();
							DOM_iframe.contentWindow.close();
							DOM_iframe.contentWindow.focus();
							DOM_iframe.contentWindow.location.replace();
							DOM_iframe.contentWindow.location.href();
							DOM_iframe.contentWindow.postMessage();
					*/
					try{
						switch(action){
							case "close": // OK
								DOM_iframe.src="about:blank";
								break;
							case "remove": // OK supprime la div qui heberge l'iframe
								if(DOM_parent){DOM_parent.remove();}
								break;
							case "refresh": // OK refresh la page de l'iframe
								//DOM_iframe.src = DOM_iframe.src;
								DOM_iframe.contentWindow.location.replace(DOM_iframe.src);
								break;
							case "minimize": // OK
								DOM_iframe.style.width="auto";
								DOM_iframe.style.height="auto";
								DOM_parent.style.width="auto";
								DOM_parent.style.height="auto";
							case "hide": // OK // la fenetre et donc les boutons restent en place à l'inverse de minimizer
								DOM_iframe.style.display="none";
								break;
							case "reduce": // OK
								if(DOM_parent){
									let isOverLimit = setDivFrameSize(DOM_parent, DOM_iframe, "/2");
									if(isOverLimit){ // on a trop réduit, autant minimiser
										actionOnIframe(DOM_iframe, "minimize");
										break;
									}
								}
								// affichera apres la fenetre
									actionOnIframe(DOM_iframe, "display");
									break;
							case "enlarge": // ok
								if(DOM_parent){
									let isOverLimit = setDivFrameSize(DOM_parent, DOM_iframe, "*2");
								}
								// affichera apres la fenetre
									actionOnIframe(DOM_iframe, "display");
									break;
							case "restore": // OK
								if(DOM_parent){
									setDefaultDivIframeSize(DOM_parent, DOM_iframe);
								}else{
									break;
								}
								// affichera apres la fenetre
									actionOnIframe(DOM_iframe, "display");
									break;
							case "display": // OK
							default:
								DOM_iframe.style.display="block";
						}
					}catch(e){
						console.error(e);
					}
				}

				function doIframeInSameParentDIV(DOM_from,action="display"){// actions : remove close, display, hide, minimize, restore, reduce, enlarge, refresh
					// déclaration des variables
						let DOM_parent=null;
						let DOM_iframe=null;

					// récupérationde la div parente
						DOM_parent = getParent(DOM_from)
					if(DOM_parent==null){return false;}

					// récupération des Iframes et actions (normalement qu'une iframe
						try{
							let lst_DOMiframe = DOM_parent.querySelectorAll("iframe");
							for(let i=0;i<lst_DOMiframe.length;i++){
								DOM_iframe = lst_DOMiframe[i];
								actionOnIframe(DOM_iframe, action);
							}
						}catch{}
					return DOM_iframe; // last Iframe (normalement la seule)
				}

				function create_iframe(_url, fctToCallAtClosing, DOM_to_append=null){
					if(DOM_to_append==null){
						DOM_to_append=document.querySelector('body');
					}
					let uuid=uuidv4();
					let _div = document.createElement('div');
					_div.setAttribute('id', 'iframe-div-' + uuid);
					_div.setAttribute('style', 'position:fixed;right:10px;bottom:10px;'); // auto au lieu de 500px

					let _button_close = document.createElement('button');
					_button_close.setAttribute('type', 'button');
					_button_close.addEventListener('click', function(event){
                        doIframeInSameParentDIV(event.target,"remove")
                        fctToCallAtClosing();
                    });
					_button_close.append('Fermer');
					_div.append( _button_close );

					let _button_refresh = document.createElement('button');
					_button_refresh.setAttribute('type', 'button');
					_button_refresh.addEventListener('click', (event)=>doIframeInSameParentDIV(event.target,"refresh"));
					_button_refresh.append('rafraichir');
					_div.append( _button_refresh );

					let _button_minimize = document.createElement('button');
					_button_minimize.setAttribute('type', 'button');
					_button_minimize.addEventListener('click', (event)=>doIframeInSameParentDIV(event.target,"minimize"));
					_button_minimize.append('minimiser');
					_div.append( _button_minimize );

					let _button_restore = document.createElement('button');
					_button_restore.setAttribute('type', 'button');
					_button_restore.addEventListener('click', (event)=>doIframeInSameParentDIV(event.target,"restore"));
					_button_restore.append('par Défaut');
					_div.append( _button_restore );

					let _button_enlarge = document.createElement('button');
					_button_enlarge.setAttribute('type', 'button');
					_button_enlarge.addEventListener('click', (event)=>doIframeInSameParentDIV(event.target,"enlarge"));
					_button_enlarge.append('agrandir');
					_div.append( _button_enlarge );

					let _button_reduce = document.createElement('button');
					_button_reduce.setAttribute('type', 'button');
					_button_reduce.addEventListener('click', (event)=>doIframeInSameParentDIV(event.target,"reduce"));
					_button_reduce.append('reduire');
					_div.append( _button_reduce );

					/* pattern pour rajouter un bouton
					let _button_ = document.createElement('button');
					_button_.setAttribute('type', 'button');
					// si en userscript // _button_.addEventListener('click', (event)=>doIframeInSameParentDIV(event.target,"enlarge"));
					// si en HTML PUR // _button_.setAttribute('onclick', doIframeInSameParentDIV(_button_,"enlarge"));
					_button_.append('test');
					_div.append( _button_ );
					*/

					let _iframe = document.createElement('iframe');
					_iframe.setAttribute('id', 'iframe-url-' + uuid);
					_iframe.setAttribute('src', _url);
					_iframe.setAttribute('style', 'background-color:white;border:1px #000000 solid;box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);');
					_div.append( _iframe );

					setDefaultDivIframeSize(_div, _iframe); // définie la taille par defaut de ce block

					DOM_to_append.append(_div);
					return _div // retourne une div avec un bouton de fermeture et l'iframe
				}


			// FIN inspiré de https://greasyfork.org/fr/scripts/465783-wawacity-dl-protect-direct-download-link

			function openLinkInIframe(link){ // fonction qui cree l'iframe et ses controles et retourne la div contenante
				let _div = create_iframe(link,clean_gbl_lst_openedWindows);
				return _div;
			}

			function openLinkInNewTab(link){ // fonction qui ouvre dans un nouvel onglet le lien et cherche a perdre le focus (echec)
				let openedWindow = window.open(link, "_blank");
				try{
					openedWindow.blur(); // perte du focus
				}catch(error){
					console.error(error)
				}
				try{
					window.focus(); // retour sur la page
				}catch(error){
					console.error(error)
				}
				return openedWindow;
			}


			function openLinksInNewTab(links, inIframe=true){ // fonction qui ouvre tous les liens de links dans de nouveaux onglets
                //console.log("openLinksInNewTab",links)
				for(let j=0;j<links.length;j++){ // ouvre tous les liens de la liste à ouvrir
					let link = links[j];
                    let openedWindow = null
					if(inIframe){ // ouverture dans l'iframe
						openedWindow = openLinkInIframe(link);
					}else{ // ouverture dans un iframe
						openedWindow = openLinkInNewTab(link);
					}
					gbl_lst_openedWindows.push({link:link, tab:openedWindow});
                    // TODO TO DO ; une fonction pour mettre à jour des boutons ouverts ...
                    updateLinks();//mise à jour des etats
				}
			}// utilise gbl_lst_openedWindows


    function runNextLotAfterTabsClosed(subToOpen, toOpen, limit){ // fonction qui retourne l'interval de vérification des onglets avancé avant d'ouvrir le lot suivant
        return setInterval(function () {
                if(gbl_lst_openedWindows.length<=0){ // les onlglets sont tous fermé, donc lot est terminé, on peut passer au suivant
                    //console.log("-------------- onglets fermés");
                    let actualInterval = gbl_lstInterval_lots.pop(); // on extrait l'interval en cours

                    // récupération des liens en echec, les remettre dans la liste
                    for(let k=0;k<subToOpen.length;k++){
                        let link = subToOpen[k];
                        try{
                            if(GM_getValue(link)){
                                incrementProgressBar(1);
                                continue;
                            }else{ // lien non résolu, on rajoute le lien à faire
                                updateLinkHS(link); // mettre à jour progressivement pourrait etre optimisé
                                toOpen.push(link);
                            }
                        }catch{ // erreur inconnue, on rajoute le lien à faire
                            toOpen.push(link);
                        }
                    }

                    // ouverture de la suite
                    //console.log("ouverture de la suite : ",toOpen)
                    if(toOpen.length>0){
                        openLot(toOpen, limit);
                    }else{//plus de telechargement, on peut mettre à jour le bouton
                        update_OpenAll_BTN_text();
                    }

                    // suppression de cet interval
                    clearInterval(actualInterval);
                }else{ // Il n'y a plus d'interval de lot en cours, on ajoute une vérification sur les liens
                    verifTabs();
                    for(let k=0;k<subToOpen.length;k++){
                        let link = subToOpen[k];
                        try{
                            if(GM_getValue(link)){
                                continue;
                            }else{ // lien non résolu, on rajoute le lien à faire
                                updateLinkHS(link); // mettre à jour progressivement pourrait etre optimisé
                            }
                        }catch(error){console.log("runNextLotAfterTabsClosed erro",error)}
                    }
                }
            }, 1000);
    }// utilise gbl_lst_openedWindows

    async function openLot(toOpen, limit=get_prefered_lotLimit()){ // fonction qui ouvre sequentiellement les lots
        let subToOpen = [];
        //console.log("openLot #1",toOpen)
        // possibiliter de recuperer toOpen avec getListToDownload();

        if(toOpen.length>0){
            let to = toOpen.length-1;
            let from = Math.max(0, to-limit+1); // +1 pour contre balancer for 0 to 0 => 1 element quand meme fait

            // extraction des liens à ouvrir de la liste générale ; permet ainsi de controler les liens qui restent
            for(let i=to;i>=from && i<toOpen.length;i--){ //extraction des liens à ouvrir
                subToOpen.push(toOpen.pop()); // extraction de toOpen et mettre dans subToOpen
            }

            // ouverture de tous les liens de subToOpen
            openLinksInNewTab(subToOpen); // utilise gbl_lst_openedWindows

            // on lance cette fonction pour automatiquement mettre à jour le tableau utilisateur
            verifTabs();

            gbl_lstInterval_lots.push(runNextLotAfterTabsClosed(subToOpen, toOpen, limit));

        }else{
            //console.log("openLot terminé, toOpen vide");
            update_OpenAll_BTN_text();
        }
    }

    function getAllDOMlinksDisplayed(){
        return document.querySelectorAll("."+gbl_classLinks);
    }
    function getAllLinksDisplayed(){
        let allDOMdisplayedLinks = getAllDOMlinksDisplayed();
        let allDisplayedLinks = [];
        for(let i=0;i<allDOMdisplayedLinks.length;i++){
            try{
                let link = allDOMdisplayedLinks[i].href;
                allDisplayedLinks.push(link);
            }catch{
                continue;
            }
        }
        return allDisplayedLinks;
    }
    function getListToDownload(){// retourne la liste des liens affichés
        let allDisplayedLinks = getAllLinksDisplayed();
        let toOpen = [];
        for(let i=0;i<allDisplayedLinks.length;i++){
            try{
                let link = allDisplayedLinks[i];
                if(GM_getValue(link)){continue;}
                toOpen.push(link);
            }catch{
                continue;
            }
        }
        return toOpen;
    }
    function getListToCopy(){// retourne la liste des liens affichés
        let allDisplayedLinks = getAllLinksDisplayed();
        let toCopy = [];
        for(let i=0;i<allDisplayedLinks.length;i++){
            try{
                let link = allDisplayedLinks[i];
                if(GM_getValue(link)){toCopy.push(link);}
            }catch{
                continue;
            }
        }
        return toCopy;
    }

    function openAll(){ // appel la fonction par lot
        // suppression des anciens liens si freshStart est coché
        wipeStorageIfNeeded();
        let BTN_text = ""
        // vérification si appel d'ouverture ou d'arret
        try{
            BTN_text = get_btn_openAll_innerText()
        }catch{}
        if( BTN_text.startsWith("STOP")){ // il s'agit de l'arret
            stopAllIntervals_lots();
            update_OpenAll_BTN_text()
        }else{ // il s'agit de l'ouverture
            update_OpenAll_BTN_text(true);
            let toOpen = getListToDownload();
            let limit=get_prefered_lotLimit();
            try{limit=getDivOut_limitLot();}catch{}
            if(limit==0){limit=toOpen.length;}
            updateProgressBar(0,toOpen.length);
            openLot(toOpen, limit); // lance les ouvertures sequentiellement
        }
    }
    // fonction qui copie les liens affichés
    function copyAll(){
        //console.log("copyAll");
        let allDisplayedLinks = getListToCopy()
        let allLinks = allDisplayedLinks.join("\r\n");
        updateClipboard(allLinks);
    }
    // fonction qui affiche les liens
    function getLinkKey(){return "lien";}
    function getOGlinkKey(){return "OGlink";}
    function makeDictLink(titre="", host="", size="", lien=""){ // fonction qui créé le dictionnaire attendu
        let dictLink = {
            titre:titre,
            host:host,
            size:size,
            lien:lien,
            OGlink:lien
        };
        return dictLink;
    }
    function getHostFromDict(dictIn, asHTML=false){
        let valueToReturn="";
        try{
            valueToReturn = dictIn["host"];
        }catch{}
        return valueToReturn;
    }
    function getLienFromDict(dictIn, asHTML=false){
        let valueToReturn="";
        try{
            valueToReturn = dictIn[getLinkKey()];
            valueToReturn = getUpdatedLink(valueToReturn);
            let OGlink = dictIn[getOGlinkKey()];
            if(asHTML){
                valueToReturn = `<a href="${valueToReturn}" target="_blank" class="${gbl_classLinks}" linkOG="${OGlink}">${valueToReturn}</a>`;
            }
        }catch{}
        return valueToReturn;
    }
    function getSizeFromDict(dictIn, asHTML=false){
        let valueToReturn="";
        try{
            valueToReturn = dictIn["size"];
        }catch{}
        return valueToReturn;
    }
    function getTitreFromDict(dictIn, asHTML=false){
        let valueToReturn="";
        try{
            valueToReturn = dictIn["titre"];
        }catch{}
        return valueToReturn;
    }
    function getterFormFilter(filterOn){ // fonction qui retourne le getter assossié au filtre
        switch(filterOn.toLowerCase()){
            case "host":
                return getHostFromDict;
                break;
            case "lien":
                return getLienFromDict;
                break;
            case "size":
                return getSizeFromDict;
                break;
            case "titre":
                return getTitreFromDict;
                break;
        }
        return getHostFromDict;
    }
    function getDictLink_filtered(filterOn="host", filter=""){// filtre les liens
        if(filter==""){return [...gbl_lstDict];} // pas besoin de filtrer

        let fctToCall = getterFormFilter(filterOn);
        let lstDict_links = [];

        for(let i=0;i<gbl_lstDict.length;i++){
            let dictLink = gbl_lstDict[i];
            let itemToCompare = fctToCall(dictLink);
            if(itemToCompare.match(filter) || itemToCompare==filter ||itemToCompare.includes(filter)){lstDict_links.push(dictLink)}
        }
        return lstDict_links;
    }

    function stored_gbl_cb_freshStart(toSet=false){
        let variableName="gbl_cb_freshStart"
        return stored_gbl(variableName, toSet);
    }
    function toggle_gbl_cb_freshStart(event){ // #TODO
        //console.log("toggle_gbl_cb_freshStart",event.target.checked)
        gbl_cb_freshStart = stored_gbl_cb_freshStart(event.target.checked);
    }
    let gbl_cb_freshStart = stored_gbl_cb_freshStart(); // récupération de l'état par défaut du freshStart
    function wipeStorageIfNeeded(){
        //console.log("wipeStorageIfNeeded",gbl_cb_freshStart)
        if(gbl_cb_freshStart){ // c'est bien un fresh start donc on nettoie le stockage
            wipeStorage();
        }
    }
    function get_checkbox_object(forText, checked=false, fctToCallAtClick, id="", title=""){
        let buttonStyle = "cursor: pointer;padding-left:5px;";
        let btnToReturn = document.createElement("div");
        let cb=document.createElement("input");
        cb.type="checkbox";
        cb.id=id
        cb.style=buttonStyle;
        cb.title = title;
        if(checked){
            cb.setAttribute("checked","checked");
        }
        cb.addEventListener("click", fctToCallAtClick);
        let lbl=document.createElement("label");
        lbl.setAttribute("for",id);
        lbl.innerText =forText;
        lbl.style=buttonStyle;
        lbl.title = title;
        btnToReturn.append(cb);
        btnToReturn.append(lbl);
        return btnToReturn;

    }
    function get_btn_object(innerText, fctToCallAtClick, id="", title=""){
        let buttonStyle = "background-color: #f0f0f0; color: #333; padding: 8px 16px; border: 1px solid #ccc; border-radius: 4px; cursor: pointer;";
        let btnToReturn = document.createElement("button");
        btnToReturn.innerText =innerText;
        btnToReturn.style=buttonStyle;
        btnToReturn.title = title;
        btnToReturn.id=id;
        btnToReturn.addEventListener("click", fctToCallAtClick);
        return btnToReturn;

    }
    function get_input_Number_object(min="null",actual="null", max="null", id="", title=""){
        let objectStyle = "background-color: #f0f0f0; color: #333; padding: 8px 16px; border: 1px solid #ccc; border-radius: 4px; cursor: pointer;width:5em;";
        let objectToReturn = document.createElement("input");
        objectToReturn.type="number";
        if(! Number.isInteger(min)){min = "null";}
        objectToReturn.min =min;
        if(! Number.isInteger(max)){max = "null";}
        objectToReturn.max =max;
        if(! Number.isInteger(actual)){actual = min;}
        objectToReturn.value =actual;
        objectToReturn.style=objectStyle;
        objectToReturn.style.position="left";
        objectToReturn.title = title;
        objectToReturn.id=id;
        objectToReturn.addEventListener("change", update_OpenAll_BTN_text_from_event);
        return objectToReturn;

    }
    function get_btn_openAll_innerText(){
        let BTN_openALl = document.getElementById("WAREZ_HELPER_btn_open_all");
        return BTN_openALl.innerText
    }
    function update_OpenAll_BTN_text(stop=false){
        let limit= getDivOut_limitLot();
        try{
            let BTN_openALl = document.getElementById("WAREZ_HELPER_btn_open_all");
            if(stop){ // commande d'arret
                BTN_openALl.innerText = "STOP Ouvrir";
            }else if(limit<=0){
                BTN_openALl.innerText = "Ouvrir all";
            }else{
                BTN_openALl.innerText = `Ouvrir de ${limit} en ${limit}`;
            }
        }catch(error){}
    }
    function update_OpenAll_BTN_text_from_event(target){
        //console.log("update_OpenAll_BTN_text_from_event",target.target.value)
        stored_gbl_defaultLimitLot(target.target.value);
        update_OpenAll_BTN_text();
    }
    function getProgressBarID(){return "WAREZ_HELPER_progressBar";}
    function setProgressBarColor(color="blue"){
        try{
            let DOMprogressBar = document.getElementById(getProgressBarID());
            DOMprogressBar.style['--progress-color'] = color;
        }catch(error){console.error(error)}
    }
    function updateProgressBar(value, max=-1){
        try{
            let DOMprogressBar = document.getElementById(getProgressBarID());
            DOMprogressBar.value=value
            if(max>0){
                DOMprogressBar.max=max;
            }else if(max==0){ // permet d'afficher la barre verte meme avec 0 en input
                DOMprogressBar.max=1;
                DOMprogressBar.value=1;
            }
            if(DOMprogressBar.max<=DOMprogressBar.value){
                setProgressBarColor("green");
            }else{
                setProgressBarColor("dodgerblue");
            }
        }catch(error){console.error(error)}
    }
    function incrementProgressBar(n){
        try{
            let DOMprogressBar = document.getElementById(getProgressBarID());
            let pValue = DOMprogressBar.value
            updateProgressBar(pValue+n);
        }catch(error){console.error(error)}
    }

    function stored_gbl_tableFontSize(toSet="WAREZ_HELPER_b8ad1e26-22a6-4ec7-980c-0d96424ad2e9"){
        let variableName="gbl_tableFontSize"
        if(toSet=="WAREZ_HELPER_b8ad1e26-22a6-4ec7-980c-0d96424ad2e9"){
            return stored_gbl(variableName);
        }else{
            return stored_gbl(variableName, toSet);
        }
    }
    let gbl_tableFontSize=stored_gbl_tableFontSize();
    let gbl_class_affected_with_fontSize = "changed_by_gbl_tableFontSize"
    function get_ipt_object(labelText, inputValue, fctToCallAtChange, targetID, size="4", id="", title="", datalist=[]){
        let btnToReturn = document.createElement("div");
        let ipt=document.createElement("input");
        ipt.type="text";
        ipt.id=id
        ipt.style="background: #fff;color:#a3a3a3;padding-left:5px";
        ipt.title = title;
        ipt.setAttribute("size",size);
        ipt.setAttribute("placeHolder",inputValue);
        ipt.setAttribute("targetID",targetID); // détermine l'objet à modifier la taille de font

        ipt.addEventListener('input', fctToCallAtChange);
        ipt.addEventListener('propertychange', fctToCallAtChange);

        //label
        let lbl=document.createElement("label");
        lbl.setAttribute("for",id);
        lbl.innerText =labelText;
        lbl.style="color:auto;padding-left:5px;";
        lbl.title = title;

        // dataSet
        let DOMdatalist;
        if(datalist.length>0){
            DOMdatalist=document.createElement("datalist");
            DOMdatalist.id=id+"_list";
            ipt.setAttribute("list",id+"_list"); // ajout de la liste de référence
            for(let i=0;i<datalist.length;i++){
                let DOMoption=document.createElement("option");
                DOMoption.value=datalist[i];
                DOMoption.innerText=datalist[i];
                DOMdatalist.appendChild(DOMoption)
            }
        }

        btnToReturn.appendChild(lbl);
        btnToReturn.appendChild(ipt);
        if(datalist.length>0){btnToReturn.appendChild(DOMdatalist);}

        return btnToReturn;

    }
    let gbl_sampleDiv_id_NORMAL = "WAREZ_HELPER_f3764ff2-251b-4670-a62c-3f0c1a008f7e";
    let gbl_sampleDiv_id_CHANGED = "WAREZ_HELPER_e4fef5bd-5b8b-44b9-92ac-7002ac3b712f";
    function setSampleDiv(class_affected_with_fontSize){
        let DOM_div = document.createElement("div");
        let DOM_table=document.createElement("table");
        let DOM_tr=document.createElement("tr");
        let DOM_regularTD=document.createElement("td");
            DOM_regularTD.innerText="Ceci est à la taille normale"
            DOM_regularTD.id=gbl_sampleDiv_id_NORMAL
        let DOM_separatorTD=document.createElement("td");
            DOM_separatorTD.innerText=" => "
        let DOM_ModifiedTD=document.createElement("td");
        let DOM_spanIn = document.createElement("span");
            DOM_spanIn.innerText="Ceci est à la taille modifiée"
            DOM_spanIn.id=gbl_sampleDiv_id_CHANGED
            DOM_spanIn.classList.add(class_affected_with_fontSize);
            DOM_spanIn.style.fontSize=gbl_tableFontSize;


        DOM_tr.appendChild(DOM_regularTD)
        DOM_tr.appendChild(DOM_separatorTD)
        DOM_ModifiedTD.appendChild(DOM_spanIn)
        DOM_tr.appendChild(DOM_ModifiedTD)
        DOM_table.appendChild(DOM_tr)
        DOM_div.appendChild(DOM_table)
        return DOM_div
    } // utilise gbl_sampleDiv_id_NORMAL et gbl_sampleDiv_id_CHANGED
    function getTableFontSizeRatio(){
        let ratio = 100;
        try{
            let DOM_regularTD = document.getElementById(gbl_sampleDiv_id_NORMAL)
            let DOM_ModifiedTD = document.getElementById(gbl_sampleDiv_id_CHANGED)

            let height_regularTD = DOM_regularTD.getBoundingClientRect().height
            let height_ModifiedTD = DOM_ModifiedTD.getBoundingClientRect().height

            //console.log("(",height_ModifiedTD,"*100)/",height_regularTD)
            //ratio = parseInt((height_ModifiedTD*100)/height_regularTD)
            ratio = height_ModifiedTD
        }catch{}
        //console.log(ratio)
        return ratio
    } // utilise gbl_sampleDiv_id_NORMAL et gbl_sampleDiv_id_CHANGED
    function toggle_gbl_tableFontSize(event){ // fonction appellée pour changer la taille des elements
        //console.log("toggle_gbl_tableFontSize",event.target.value)
        gbl_tableFontSize = stored_gbl_tableFontSize(event.target.value);
        try{
            let lst_DOMtargetToChangeFontSize = document.getElementsByClassName(event.target.getAttribute("targetID"));
            //console.log(lst_DOMtargetToChangeFontSize);
            for(let i=0;i<lst_DOMtargetToChangeFontSize.length;i++){
                let DOMtargetToChangeFontSize = lst_DOMtargetToChangeFontSize[i];
                DOMtargetToChangeFontSize.style.fontSize = gbl_tableFontSize;
                //console.dir(DOMtargetToChangeFontSize)
                if(DOMtargetToChangeFontSize.nodeName.toUpperCase()=="DIV"){ // pour changer les animations
                    let loadingDiv = getLoadingDiv([gbl_class_affected_with_fontSize],"", getTableFontSizeRatio(),0,DOMtargetToChangeFontSize.style.borderTopColor);
                    let DOM_parent=getFirstParent_as(DOMtargetToChangeFontSize);
                    DOMtargetToChangeFontSize.remove();
                    DOM_parent.appendChild(loadingDiv);
                }
            }
        }catch (e){
            console.error(e);
        }
    }

    function createDivOut(lstDict_links, DOM_prepend){ // fonction qui crée la DIV qui heberge le résultat
        let DOMout;
        try{
            // creation de la DIV
            let DOMdiv = document.createElement("div");
            DOM_prepend.prepend(DOMdiv);


            // creation de la barre de progression
            let DOMdiv_progressBar = document.createElement("div");
            DOMdiv.appendChild(DOMdiv_progressBar);

            let DOM_progressBar=document.createElement("progress");
            DOM_progressBar.min=0;
            DOM_progressBar.value=0;
            DOM_progressBar.max=100;
            DOM_progressBar.id=getProgressBarID();
            DOMdiv_progressBar.appendChild(DOM_progressBar);


            // création du formulaire d'interaction
            let DOMdiv_menu = document.createElement("div");
            DOMdiv.appendChild(DOMdiv_menu);

            let DOMlabel = document.createElement("label");
            DOMlabel.innerText = "Selection du Host :\t";
            DOMlabel.style.position="left";
            DOMdiv_menu.appendChild(DOMlabel);

            let DOMselectHost = document.createElement("select");
            DOMselectHost.style.position="left";
            DOMselectHost.style.color="black";
            DOMselectHost.id = gbl_selectID;
            DOMselectHost.addEventListener("change", (event)=>updateTable(event.target.value));
            let DOMoption = document.createElement("option");
            DOMoption.value="";
            DOMoption.label="";
            DOMselectHost.appendChild(DOMoption);
            let lstHost = [], host;
            for(let i=0;i<lstDict_links.length;i++){ // parcours des hotes possible
                host=getHostFromDict(lstDict_links[i]);
                // ajout d'un split sur le host en prenant en compte des hosts melangés avec des qualité
                let splitted_host = host.split(" - ");
                if(!splitted_host.includes(host)){splitted_host.push(host);}
                for(let j=0 ;j<splitted_host.length;j++){
                    host = splitted_host[j];
                    if(lstHost.includes(host)){continue};
                    lstHost.push(host);
                    DOMoption = document.createElement("option");
                    DOMoption.value=host;
                    DOMoption.label=host;
                    DOMselectHost.appendChild(DOMoption);
                }

            }
            DOMdiv_menu.appendChild(DOMselectHost);

            // openAll
            let DOMlabel_Lot = document.createElement("label");
            DOMlabel_Lot.innerText = "Lot de :\t";
            DOMlabel_Lot.style.position="left";
            DOMdiv_menu.appendChild(DOMlabel_Lot);

            let DOMinput_lot = get_input_Number_object(0, get_prefered_lotLimit(),"", "WAREZ_HELPER_input_Number_lot", "Choissez le nombre de page à ouvrir simultanément")
            DOMinput_lot.style.position="left";
            DOMdiv_menu.appendChild(DOMinput_lot);

            let DOM_BTN_openAll = get_btn_object("undefined", openAll, "WAREZ_HELPER_btn_open_all", "ouvre tous les liens PROXY du tableau filtré et ferme automatiquement une fois terminé\n ferme aussi si la page est figée");
            DOM_BTN_openAll.style.position="left";
            DOMdiv_menu.appendChild(DOM_BTN_openAll);
            update_OpenAll_BTN_text(); // on met à jour le texte du bouton en fonction des preférences

            // copyAll
            let DOM_BTN_copyAll = get_btn_object("Copier all", copyAll, "WAREZ_HELPER_btn_copy_all", "Copie tous les liens authentique");
            DOM_BTN_copyAll.style.position="left";
            DOMdiv_menu.appendChild(DOM_BTN_copyAll);

            // updateLinks
            let DOM_BTN_updateLinks = get_btn_object("update", updateLinks, "WAREZ_HELPER_btn_update", "met à jour le tableau avec les liens authentiques trouvés");
            DOM_BTN_updateLinks.style.position="left";
            DOMdiv_menu.appendChild(DOM_BTN_updateLinks);

            // supprime l'ancien stockage au profit de ce nouveau
            let DOM_CB_freshStart = get_checkbox_object("suppression des anciens liens stockés", gbl_cb_freshStart, toggle_gbl_cb_freshStart, "WAREZ_HELPER_cb_freshStart", "Si activé, supprime le stockage précédent");
            //DOM_CB_freshStart.style.position="left"; // retour a la ligne
            DOMdiv_menu.appendChild(DOM_CB_freshStart);

            // change la taille du texte du tableau
            //get_ipt_object(labelText, inputValue, fctToCallAtChange, targetID, size="4", id="", title="", datalist=[])
            let labelText = "taille (code css)"
            let inputValue = gbl_tableFontSize
            let size="4";
            let title = "change la taille du tableau comme 100%, 1em, 10px, 2cm ...";
            let dataList = getFontSize_options();
            let DOM_ipt_fontSize = get_ipt_object(labelText, inputValue, toggle_gbl_tableFontSize, gbl_class_affected_with_fontSize, size, "WAREZ_HELPER_ipt_fontSize", title,dataList);
            DOM_ipt_fontSize.style.position="left";
            DOMdiv_menu.appendChild(DOM_ipt_fontSize);

            // creation du tableau de démo des fontSize
            let DOM_DIV_table_fontSize_comparaison = setSampleDiv(gbl_class_affected_with_fontSize);
            DOM_DIV_table_fontSize_comparaison.style.position="left";
            DOMdiv_menu.appendChild(DOM_DIV_table_fontSize_comparaison);



            // création de la table
            let DOMtable = document.createElement("table");
            DOMtable = setTableStyle_forImagePerfectFit(DOMtable,gbl_tableFontSize);
            //DOMtable.style.border="1px solid black";
            //DOMtable.style.maxHeight="10px";
            DOMtable.id = gbl_TableID;
            DOMtable.classList.add(gbl_class_affected_with_fontSize);
            DOMdiv.appendChild(DOMtable);

            DOMout = DOMtable;
        }catch(error){
            console.error("[createDivOut]",error.message)
        }
        return DOMout;
    }
    function getDivOut_limitLot(){
        let limit=0;
        try{
            let DOM_inputLot = document.getElementById("WAREZ_HELPER_input_Number_lot");
            limit = DOM_inputLot.value;
        }catch(error){}
        return limit;
    }

    // images en 62x62
    function getIMGsource_RedCross(){
        return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD4AAAA+CAMAAABEH1h2AAAAvVBMVEXwAAD5+fn+///xAAC/AAD29vb9/Pz///+9AADw8PDOAADvAAD49/f7+/v19PTv7u7y8vLCAADz8/PDEBDwBwfoAQHXAAD+9fXkAADABQXFAADmn5/56Oj7ycnzQUHdAADOPj7IIyP3+Pjwysrx4+Pab2/FFxf3iIj0T0/1XV31b2/nqqrrvLzgl5fRR0fxHR3PQ0PyLCz+7+/84+P4mZn82dnxFBTMAADMNjb6s7P5pKThh4fcgIDw+f/5/wDxlQJ/AAAE0klEQVRIx5VX6XqqMBANUQhUAogoKrgB7hu2ttrbvv9z3UnYwmJr88NPPjiZyclsBxESmBolkmlKRNFMnWDLDIgbHpfxYjVS1dFqES+9MLJo/togxDYtTGTTRAxuUkJTuEywHR2+TgyZr9FoFX+HLuavMzjh8CDQZVnPfwLqe6cew7S74xtf426bPfdOXhTAkuGj/AeZyY42IQZzyD/emd3ubTDs9zvJ6g8Hty7b8O75mqYkB6UanJEgcAgzOMaGadNDPGLYWb/TarUQXx32t9OfsR3a870JcE1jcC0gGFGqW5ZEJcsKcLQEt7svw06KFBbsMHyBDXrLyJApNSyDUtmyBOpoOIf9b03gZAfYAFiYH2SBOonqti3RwLD3C1Udzx6Bkw1mY1Vd7Kkk24YEP3ZGnYE9cPzW/wHMN+jf4ABHLacuYx7Q7UHnFzRzYNAGPM3gkqQbRkD3HI2eWBy/l2Vw3jAS6nC4eBad4BcHI6FOUXTLjoDzZ9EMD/xHisIuTtNkTJfA2tNoCCTgb2lqAcacukNPHVc4dyqQy269cQr+x3B8jVGny4Efq+2ZiHam18+p+Hy5+oS424L/WVud+4GsA3X0OFJfRNenny4hfvHxlIFh7QT/X9S2B5wjjP272h0Wxp31K//Yz+xvk2fydhFMDLvqPdI0ZNleybizVpKvyeSc2H5Ln9cl+ph5rCAzOpWMT1Nb2fcfk/Tp/VyiFsyfXIICoF28tF2OJu4GntfZw7Z8ec5N7YUUkS9VFWnfuAX+/YI2mTNXpwKfqeq3hVzwvS969a+Ak8lmUiZCgMPdxxEKV5WAO38WcCVz5XVajTwHvF+FCC59UA64yzuprXUtch1noI48tFTbw0qW51dVHOKjHvgORN4SxXD0apHYVPDKtiFvnH5XjdFCHddyrVPBNxgH74G7BVo1purG//nk6c2v0Kg507evAvyf8yDrR+hRoVgLcHfbaB6KxiN4J4/1NPwewEePytRW+cV97vzqEXxXurpdI3zVeHGlRCXl4iHA2cU1hQ03rlQC71zrVyxsGoK2OfCrx28NWdB6tZThrn/WsqZ6/BakzLGesLVbf3D8Dk/YKIYWUTt4mud0vX1/dPw+K3bI+i4Xq1LEfjpFtaoUrBYUqy+CaNirep/ny4QF27WA023J994hQMQtF+oC7V65s+f3puBtsUIdQYPGXrvco1LaJtvU1a3bkLrQJkaewRp0VG5S6DJRlNfJ7txUe3eC8bvPG3RQNf+x2UzF+lKU/px71qNgwEka9LzSoKtlKWPvbSo06Dht0IG2r48H5Ri8sttz857Px4MDn20wDjTzt+HEme7Wu6kjFoolxTJr0JasKE+MRk51NLItXVH4bEOMw18HsxCbfCw0DDbgyX8dC2EINnRJQqmWoce/DKVeScswKaQdnx+JPWxkcNsG5w34oc8P5DYMwZJt61RKqONaRj4wOfDyqxwIaaofGHVwcZm2MH4QI6gQIzhI1YtOKcIQdfzsMOIr5n7ezqWQoGNyKRQfqA3SATPqsGxqqKwiNd+7M9U2ZkKsIwixMVOD96NfVZElVcdkXvRYBvo0ECWjHgQCdellaNgNv+OSCAUhe/o6RAZ/zWVgTl1FRersPbWi0BMl8DF04YzZa0FF/gfeDJQAHWaARAAAAABJRU5ErkJggg=="
    }
    function getIMGsource_iframe(){
        return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD4AAAA+CAIAAAD8oz8TAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAxvSURBVGhD1VprcFXVFb7nec995AZCQhqJxULAB9WKIogN1IAVHArFsR3tlHYEpdWRTqfTTmvtj05/6Ghn9IdVR8cRZtrRVltRa6tGbdAaUSiKU18QMCQgIeTmcXOf59zz6rf2PveZm5BcIkM/Nufss/faa39r7bVfF4RMJuP7/0QF6q7r4in4BNeHDD7YW0CW158Sk5UrhyCgU3p5XbOC8VFC3SMtCMi4roOMJPolUcprmIA/ryLBSQlVADq3bNtydORFQWIl7gTsC9SLeDvIBZSg7fpGkj2x9FHbzqLKcW2mi0mPAVqjCm0d1xmXnUccHdglNlBe8MvBWTUtdeHzUKybKUEQuRMhxkajHB71PG/HsSVRQfrw6LN7Dz3RN/Jf3Uq4jkUyIE9SHsqUeaTIhCKhcQALvRzB0ySLiqbOnFu/9OsXbFt4zmrDBDF4ShzP9wXqnLcsqoY1unPPtv1HnhZFGebajsm5jOVaEcViU5IBAbgMHJD5xkU/u27x3bZjY7DHY58PGBppURQtW9+xa2NX35shbYZhxhsiLXMblgf9s0obu4JPgmGs33KNeTKCD/okPlAVw4xiAbxEhQ26O5o6erh/13CyV1MiCT224sIf33DlI1lTh0xR1wUQdWpIihxNDf31nds6P30srM20HWP1JXctX3hb0F+HeVqx71NgSk0oHH3xdH/HR/d2HnjYr0RS+vCNVz121QU/yhhJjMdYBp7XHcdSlWBvdM+j7auwqoD3ja07lrTcZBhZWVKzVhoTC17Me3SSmJw0lyJmCFe/qrbvv7v9g99Kkr82eM5PrtutKbW2azHvlbAHGxou+F0WxP1HnjJtw7ASrRduWzL/pnQmadqZTz9/CVGkyiGSRvSTAyabsMadOomyKCBJkihjXqX11DWX3LVwzjcdxxxKdHf1varKKsJZQJCWwqOO9hkzfWxwH2wLa/XLWrYa2SzG4eX9v3mkfd2OXdcn9X5F1rDs5geO3DAtyGkCDTYjaT+5csFWTqwnuhsbFAHbVCmIOkRFQTTMVFI/iVV5Vs38meG5lpNlhQlZ8qE92Kf0qKoE4BjIoxW0MQ3TBqJPs1ayHaexdpGm1qKL0XQfn81jg4+oA6iDubZjQU4SVSSwMy1jwxX3tzS2QsXnQ+9v37UxbURVOQgx0vUFsCeFtDW4CB7s4ogR9OXQFsf2plJ41FGRGznKs08RzQLqzJvbds5tWIbSz4fe295xfcoYUmX4vhA50wjoRGAwxXiIeDNKPJbKu/Ook2QpOPuslQn46za3Pffl+qUoxGTY0QHfD6mSxx5iXJiD56l9tYAD4XdGmCjlTh/l9IBcwPAXA28GoA0GDuyxJW1e9dy5s5ag9tjgXsR9JjucZ49C3hlrjQx7nwbI80wn8ghjol5pj8gFDH+VopR9/eZVzzfXX47S3sG92z32GsWiaytSgMljfUAfp8udmFLQkx5yIWhUIljwOlgC/LMYefYhf/2Wtueb6y6DMDYv8r0Zk0W/poR6o28/9PKK/thHiqTiEFJRzxSA1rQtEDcXAYNjzMRe5/bxzzxyJTn22uwt8H3dYhT3RN/d3rHRdvSegXf/+MZ3D/Xv6xvej3Wh9FRYDWB4noyDoxU5YkLqTNz7LAZKmRM5+3RIa9yy6oU5dYtR0ht95/HX1z751qZUdiSoiv2xj0mQmrBXtaAAASP8ydlwioChRYmFF4ubElHOPhc56bDWuLlt53kNyxVJOzq0L5454ZdDcHY0ftC2cWSF472G1QEThjTQ6kiTje4ujFgZCm5mRlKfzMxyUZThCQGwz2QTdbXNq776K+y4qhRkh2xLlvw4cqSzMe8QWz19ciEjTSsAu+9RyViFBerEmPMD+JCVgmpdXEesoFZ7pG/Ps3vuwKbLrk4O5EVBSWT64+k+WMK2lQp+mgyYy9FcCvkbagIN9TUtkiCzknKFFYKbs6EBGwPMd3g3OnroiY71sdQx5Ol4iKOfj859hpUcTHThEEjGMyfxzJQAilhtNXXGrde8dOfGT65f+geMLYIQ5ajlNDgqUWeoSB0AV92Mzwg1RwJNppVK6yNpYwSnNPRnWnY0fhhdcBVslaSlbRIJ/RUn3A2EgFrnV2pAGlsHyTCrmGLPAO+WBM/p2diDLy0bTByZ19h6+7W7bCfLYqTEANYK4Y7FOxvP9A8mDg+MHjgZ+3Ag3hVL9cZSfbiSLV94S8qII2w0JYDW4DUxckwqgPtPEnEI8xlWis1bz/fEbHzqJpdgSvIgbZBHOcjhcIcjEopMy0ro/ZaVqQk2YSSxT8Hfnxx/8bP+NzPZ0QoH1iLQ8LgWevK+i8Ha1QbnLDp3w7zGlaalw/1sBSMCU6POLWa+QAYfbHhJDLGuQKlp65gAo6ljz+y+FXdkrGsTeJ1rKc6MBapAQZaUq86//VuX3cf2JywJFOcF6hljBNSHkj0Tet1DzoZioMyBHtwGH399zZGBvX45gHtDSKtnlYxFGWjHoRgYrxbVGBAsXIIgp/TktZf+cv3l9+lZ79elMq9fOZjongz1sSDirh30hzs+euCFvT/3K8GmGYvWL/n9zNA8+Im0jFVF4+6dVSoCOhHbh/vfeHHfL3QzCWdvW9vZNHNR1tLhlJJ1nQ9EdaBufKJpmQeO/1MUBU2JfK/1TwvOubom8CUEaySIFWlOeQo2ozaszR43BWYH/Q1Lz9+05tLf2Y5hmMmuE69KkoSIR48FrugbKM5MCdxyyzZT+qDtuPBNfWRBKpPA6GGxQsfjJFSNmxxqa2YN+yuzWwNKBIGO4AFBPoolXge8j+pAmyiFKAxHJGBdRxyi1LNr6gkNRbrm0WkUqsif2DQQQ4xmhQip2gYKGQYyIDduVWsD0DB/poBCrobI07vybopdsJozdzFDRrhKxsXgl4wSbbl3ReoE7+MsQ7FPpzNgzgBwafJyFamfzSj2aY762RohEyBHHXOZBbn3eTYBxHKZEhS8juUTu6v3WT3y9n/hXiimjkA6/dDHXkJKGP/pYc9+UCKULR0VAoa9qu4V1Gno2HyanmUKZKAT2zPR8oaU4FFHIfM6dUZ/2d2W1UwVzHB62aR1OkDc6FxA+z9nyJEPGHRGHbIsPUi0mr5pePHCAcbTdNooBAwuraTWg0edHI4a/CW+uNkwiap8j57oOX0BAzB6dLIr303BDzcxSfSrMm7gvkw2Zlg41yO8mO+nzv6LwtiAYfwsTQ01RBYgP5LsPT70viIXfrM9i9gXwaNOT59wYfM6ZpS76+P7cMbHBRlPFvFsYCZM1IyZSQrOCLyAwZpmmPqiczc0z7ocX90n335m91bHNcJaRJECsqSVJpQUEgQQbFDieeBMITdNfXT39suhDVfcj/uILKrvdT/18CtXdx54tG/4/aFEN0/Dye7B+KFo/GBxOjn6aSx9lEUdeYEcwdzBM6cJvspV1Ea/CPAc6uhKr4Y/6H326c7NWSsNG8geJSKJCpchkA5o8bwLmzGn5zeu2Nz2d5v+Md59pH1lT/S985uu3npNOxRCHAcMLjxVsK5cSdYGRw8++trqkcSJlYvu+M7yh9JGUqIfOnNCcBtWlXQ2+bW5N9y25l8LmtpQjpUnY4wkMgP5lNSjuDjjWZTSuO3C8PycQY/IA1SYW5WrABFjrdn/8KCLHXuyijKvs85AF54Ou47VPfDW4f6OwXhX1sqgqlhMFHBfJoCZ6Rj1NfPXLr4HeQzU46+vOXTijYbIvJ+u+4+m1NLoncbRCKtcKFiz/7O/PfnW9y3bXH3xneuX3JPSE5KkFKgDnBYyGGgcJP1KANfxU/7eCcBgmAebg/6af+z79Wsf3qtK2pL5m759xQOKFMao5y0vBwVf+bmKA92CDwKhJ9r5584fYsAtR9+y6sWLmtfq2RR8VEIdoBGBL9lORL/U4DFer6VAH/CQLKmx1NGHXlmR0ocwNg2Rllk18xiNykAnMNj7qADBso3jwx9gjU4biYu/vO7mtp38LACG5dQ5ig3gJZMEhktTwl0n2p/89w8SmSiLTq+qCqAp3CaJom07LU2tm1b+JazNtuws3ESRWpF61WBedDQlNDB6sPPAg73RdwwzOdG4sQmNycANzMtx0gL7z2chfwP2ymULblGkkGXTr43oZVyvVweuERlEjiIHZUlAUFrsZ9cJAHJebgyYNkGVg4ok6aaBISUjcxEx/V5n5BFpdDoQRWUCZkWoHFW8lKmy2W/CXgBzB00zdSCvnWemBWWkOaaf+hmCz/c/or2GGmn/2iUAAAAASUVORK5CYII="
    }
    function getIMGsource_reload(){
        return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD4AAAA+CAMAAABEH1h2AAABXFBMVEVHcEx81vg/tuY6tuVkvOt41Pd/1/lgxe5exO5exe550/dfx+9exe561PdCuOZgzPFhxO5/1/luz/Frz/N40vJLwuxz0/UzsOMxsuN/1vlOxOw1r+JUxu0zseNhzPE+tuZz0vY8uec1sONeyvA9uOZCvOg7teUvx/VBxe8vvutFx/Fc0PXp9f0XsuXx+f5i0vZn1fg0v+wKruITseQQsOQluelv2PpTzPNWzvRr1/lKyPEbteYsvOopu+o5we193fxNyvI3wO08w+4Nr+NPy/Pb7/sgt+jU7fru9/3Y7vt52/vS6/ly2fvk9Pzf8fuE3vz1+/6C3PvL6Pl12vv5/P/P7vscs+QitubO6vlu1fcruOd21/dHw+x+2fkms+T9/v9Jx+9azPE/weu46PnG5/ie4Pin4feR3fd81PMts+RSx+40uedjy+9r0fOI2PS/6fk7venF7fuw5PhHcEw5Yz/gAAAAdHRSTlMAwGu/AYfNEQ4dRjQpbkbNCPD5X/7Oy8nyqPOMjdG9fqjtp6epx8f/////////////////////////////////////////////////////////////////////////////////////////////////////ACN1kWcAAAWkSURBVEjHzZf5U+JIFICH+1DwQh2vce4SuUYRooAMIBERQWXlCCFyhCQQueT//2FfdxIu44yzW1u1XyjTsd/3uhPyQufdu/8r+mWzyWRe1v8D1bSwZtjSGAHNlmFtwfRHrtVgXGHugdvb+1vYrRgN1rdmsNg0K0hEyDtgxWizvGVkm5HBI/4cc/8TZ7o32n43A71Vw8jq9RQ4CSTVWH95Hc0GOGXJ/Evi9ucN2uEc6CIYzK8PbfnIMEiG+BuJ+yx5G0QNnAJNYevVK7CoYRjkovCgBPdQywqoIaW4vmYYzeIr9gbYIAenYGu1mptTjlAChjGq+hYNkiHobEzwmqw9PNSuOOU4GES+RmX+5o/0NYysmD/O7jm2kLt7QHj5cUbqBhJsvbh+egNN3wSpsx8SQeHZjdQ7zIN3pHScUWgChvnvz7pC34zlH7fPXqR57xS8LKX0UcEbesU6d69p6CAK8CHOePedd55BEPf5UAKa1szefzYHRcmyjxpcea9e4H2mfUoC8G0zV30DbNTl8rmo5yt1CjT0Sgko2jh99W3YdiF87JUbc+VOZ90TwGddEtifGt60Abbcx8nh2WeBTk3sXIHlaJcC+BuTs7eu9sA+BQiGzGJIwUUwuSyMn80VBlyf8p1OAJ9yTC6+YWy72Gw2B1uKIU4JIZtLDXiB9p0SiGnf16MMk7mDjkOSDJlDpNpJOPL1kZlMElPIB+CPZ7+wiuwkQIxyJEnmSCGJicWSs8QIyoXjYPzVBVlf67kaBMTGQr4yiWCJmAqh0Ckz8AohaCaJhq+3ppx61wV2KBQ6ZNKYdkgNl1B4qNVY1ATf1ZNPXv+l2yBioUOAS6eAAXGoBl9DFJLQDMVg+I9S3Sx/ALuOAuqjVCaTSfGq9oGAizfbOECRMcL1YVmq9KUGETo8AOpsplwuZ/oHaiTad1C/SAcOQ0RjSap601JDrOOAEFtGtBOqeg/Xb7aBe+tiY8mk6DB4AqizeaDsiCZUiDpQ3YKOemF4RTcvEXWwo9HowQjp+XY8qkK8j+s+XYc2+HVRnvzyB5h7IhqPxxN8vtVq5YW4KrwXl30CmlGky5dO/0Wsg30E9EHPs23cnqdewFXPozb4dfGL/MDbFasJMJxOZy/f4h1V1HpJW6rcNjTBT1TFXeWmFatNrESqQjcaiajJkYMW1K7bnarj7qNmVVRu2oVtpEcw55Fpzs/PI0e45RTwY8DNSUegbyslY1oHHcdOEwicO5uNNsf2UJI2PAVyuWy6EUBHEdDXlYLV7yId4qeIxMWeMMqT8MDpBwLOfho/B3IcjjpH+u74aWPfntGd1W6fH6TgyYGqFwYUeVzHZK7VvFT0bfvkUbkOeiBwKdFly2nsoS1NlttcBg4AMtXFATC3o+a3qR8KbXXoDJQkO9zN4KJPwSZ9SOkpkE45pIhSIDJsaqeXFetDZ6V0GcZcdltQ9hm0ZWZ2DingslRxDtdnfqS1zWElIOvhsDhAdT9LqtWVey8Dlaehdubn2fRtGAmUwmEPxl8d4cKHrSw3MlxV6guHS4GnoW5uiWb/9FQZ6x7/kAcrDxv6lDN5vlvyj/XK0yf7/PJgf4h8j1/ipMKVcfFCitaoL5ZO5A4Psp/2XyzvzF+xDv4JptTP51vwWRWHJf+F9D+wPUXQv6os7iw68ItYv0AU21D7Ld5zfCGDdWTrVJd2i98l/0QO969C8TsuJpxI9vfXFna6sX+M6Q7y1WOZsa1bfHUp/nXOr64WZ+1O5/MvluXm/U+dx2IRzv/ieAaQ/cXiY+f9vvmXC3K7rqMkUKaAzxrLHZ39dy82Ju1e5xESoDsAvgP8dcG0i4+PnT3tW15ILNrN9zgDwoP+PIL7flNreeurkH0HMkAKiQ64O/Y/eZnSmxa0O591m3t7m7rPO9o/exH796+B4xT/6Xvq32ElcR4fm30ZAAAAAElFTkSuQmCC"
    }
    function getIMGsource_clipbordWait(){
        return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD4AAAA+CAQAAADZyGDPAAAAAW9yTlQBz6J3mgAAA0pJREFUWMPlmU9sFHUUxz8z0+3alpaULqR/DGAhxZSm/GsvNtXYk9QgJR4UNKLc7MF4sYQbXEhDOFAS/kh6sGq0tdEDGBMNpCEeCB7AhLSNJtAQIVEW1EaDbcPOl0NLaJfuzpt1SiH7vc3sm/eZ937vzfzmrUOaJBZMjjP32F04VLAKcr0wxS3+Js4Kljxu+DCnOEuSOA28QwdF0aRCBg1pvVC51mu1XBWpS/9aLguupmAX19UsV7t0Qbc0pmN6VoX6+HHBe4ReVVJSUncl9SmuZiVzgDuPwue/qT85x1V8UgwySj+vM8hBNnMYl21c5D1W41NGK43zuZ2GzX86KPI7eksxIYQcdei2fO0UKtVFSZ8pMfMbek7fmiM3Vvv3DLCOHRQC1WylAniNYTZRC7xBDT8xhcMIAxyhzVj9WdIubvALk4DD53xJN3vnWPrcoZiSOefGeJkpukkgHCqp55lc0u5rUI2Ky5MnT67QUUNJ3VCdUIE8eSpQQu/rj1zSfoUubvICFQiHEUZJGRIpUpTwIsWIFD9zggoOZHyGZ4SfZYzd9LAE4XGSTk5TTWHAGl7iJhvoYxkCfmAXZ/iA5WHhSWALS2eO2mlliCGyL5qDTyl7SMzYbSTBOP9ltC/I7uyBVtHLF/yKH4AvZSvtBNWVCT67QurYb1h11wwOhKfLC2Ns0KJuJvIXbl7ze9w1OiyOGi56+dRkV8Uh1kYNv8YVQxuJJONRR+6yjzdJBeJFGWuihkM55WanVuVvqz0NfS4chOUb0gnxajEX3Bm+wTfcZDUfUhl15N/xicmygu1Rw10+os3wPhcJNhrRIdJeS63ZqVX522r5CzcX3GXOm/p8OR2URQtPcZxek+VS1tASLdzjXSpNkVdRb0SHSHuLOR678rfa8xduLrjbXDNVexl1xKKF+3RzEsewl1nBVzRFC3d4nqbA0cB0ny8zokPA97DTtIeLEY8aDm7axC0K5W+rZYWHGe7k4iEjPAb88z/Rk0zhZYkvY8E1EKOftVSZany+mO/xNb/xSpav24xT57/opB8vYOCZTWKCGk7R/hCWRssy8v6dPn5kIme4w0re5qVZaQ8BB5g0PM8zqzBtbBgSHq2eqL8zFxV+H9O6OlrpjFZ8AAAAAElFTkSuQmCC"
    }
    function getIMGsource_clipbordOK(){
        return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD4AAAA+CAMAAABEH1h2AAAAWlBMVEVHcEzV1dXBwcFWVlYTExP+/v719fX///8EBAT9/f08PDxcXFy6uroMDAxBQUHv7+8bGxtra2uVlZWtra3n5+eLi4ssLCyioqJMTEx9fX3MzMzd3d22tra+vr5dzXHbAAAAAXRSTlMAQObYZgAAAiVJREFUSMftl9nSoyAQhSOyNCgCsri//2tOG5OpLH8ctGrmYirnQitFPhtaON1eLqvEcV0e9FdwM03mNG5aZa2K5hweStApaSjDCZzJAVRtTN2Ak0dxKUVh7SimSYx4Z1IewEOsylKBE2NKRDhQZVnFkIvzClC6KUQH0Imi0evv0mThTBCdPFkIhgvDgFdDlsUnveDQH/DQOud6qB6ftslBg0Nt2MNDD1dV74ly20g/7eAtNH6uI/SBv8iUMNSz7yF+xlkFHq8hgWpepCCtcWco5UdcVlCvT6kVfZOa13+QDBxzXbxpe215OM7gTYfwD/rieTifyDyPQZ7CQ9vb9dwmR/hhXHoFkEpXNRaoMwdxHtEiZ5w340VMuN2lkfm4bLXtfk95GqVsVZ2PE0r9k3O2mubjHI81e6G7/MkvWoVHx1/pA0dmQE+55eoe+0Dmea+JqFUrt9hxpYMPubhJdhI11dflrrRnIkKXibMrLju6LhhpizSup82OrmhxWzK/0ejTudHXm7/tnQppcU9HbubbrSbjxGGjxUhTduq22nxNutpo6WDIf+/YGWz1VJptt3hqi3ycBSzuD/W4Tlvesw/smKAf5b1DsjDwY3YxNmArP04FiQpo5EfNKgwJgFqrQfe1PGGVU+capfph4eeclklujPwWqf8eR08ZDN+Ridgnf8aJ1Qp32mdpuuzgzP/Q0T11d17udtQ/dHTP3R37dx9iX3wX/wXRx2Qemg78NgAAAABJRU5ErkJggg=="
    }
    function getIMG(imageCodeName){
        let DOM_img = document.createElement("img");
        imageCodeName = imageCodeName.toLowerCase();
        let imgB64 = "";
        let alt="";
        switch (imageCodeName) {
            case "delete":
                DOM_img.src=getIMGsource_RedCross();
                DOM_img.setAttribute("alt","Supprimer ce lien du stockage");
                break;
            case 'recharger':
                DOM_img.src=getIMGsource_reload();
                DOM_img.setAttribute("alt","Supprime le lien du stockage et relance l'iframe");
                break;
            case 'acopier':
                DOM_img.src=getIMGsource_clipbordWait();
                DOM_img.setAttribute("alt","Cliquer pour copier dans le presse papier");
                break;
            case 'copieok':
                DOM_img.src=getIMGsource_clipbordOK();
                DOM_img.setAttribute("alt","Déjà copié, cliquer pour copier à nouveau dans le presse papier");
                break;
            case 'openiframe':
            default:
                DOM_img.src=getIMGsource_iframe();
                DOM_img.setAttribute("alt","Ouvre le lien dans l'iframe");
        }
        DOM_img = setImageStyle_forPerfectFit(DOM_img)
        DOM_img.style.cursor="pointer";

        return DOM_img
    }//openIframe, recharger, aCopier, copieOK, delete

    function createStateDiv(link, fromCopie=false){
        //console.log("createStateDiv link", link)
        let fromStorage=GM_getValue(link);
        let DOM_state = getDiv_as_fitImageContainer()
        //console.log("fromStorage", fromStorage)
        if(fromStorage){ // on vérifie si le lien est OK ou NOK
            //console.log("fromStorage",fromStorage)
            if(fromStorage.startsWith(errorPrefixe())){ // il s'agit d'une erreur
                DOM_state.append(getIMG("recharger"));
                DOM_state.setAttribute("link",link);
                DOM_state.addEventListener("click", function(event){
                    removeLinkFromStorage_fromEvent(event.target); // suppression du stockage
                    replaceState(event.target);
                });// demandera une confirmation si link est manquant
            }else{
                //console.log("else", fromCopie)
                if(fromCopie){
                    DOM_state.append(getIMG("copieOK"));
                }else{
                    DOM_state.append(getIMG("aCopier"));
                }
                DOM_state.addEventListener("click", (event)=>copieTarget(event.target)); // copie le lien
            }
        }else{
            // le lien n'exsite pas, est ce que l'iframe est ouverte ?
            // si l'iframe est ouverte, est elle en top
            // si elle ne l'est pas alors laquelle est ouverte ?

            let lst_divIframe = getLinkTabState(link);
        //console.log("createStateDiv lst_divIframe", lst_divIframe)
            if(lst_divIframe.length>0){
                for(let i=0;i<lst_divIframe.length;i++){
                    let domID = lst_divIframe[i].id;
                    try{
                        let DOM_iframe = document.getElementById(domID);
                        if(DOM_iframe){// l'iframe est ouverte, on verifie si elle est devant
                            //console.log("createStateDiv page ouverte");
                            // en arriere plan
                            let loadingDiv = getLoadingDiv([gbl_class_affected_with_fontSize],"", getTableFontSizeRatio(),0,"cornflowerblue");
                            DOM_state.appendChild(loadingDiv);

                        }else{//iframe fermée ; on la supprime de la liste des TAB ouverte
                            removeIframeFromListOpened(domID);
                            DOM_state=createStateDiv(link, fromCopie)
                        }
                    }catch{}
                }

            }else{
                // iframe non ouverte
                DOM_state.append(getIMG("openIframe"));
                DOM_state.addEventListener("click", function(event){
                    //console.log("tente d'ouvrir",link)
                    openLinksInNewTab([link]);
                    // on lance cette fonction pour automatiquement mettre à jour le tableau utilisateur
                    verifTabs();
                    replaceState(event.target);
                });
            }
        }
        //console.log("return", DOM_state)
        DOM_state = addAltAttributeTo_Div_as_fitImageContaine(DOM_state)
        return DOM_state
    } // utilise gbl_class_affected_with_fontSize
    function replaceState(eventTarget){ // supprime l'état actuel et recherche le nouvel etat
        let DOM_divHostingImage = getFirstParent_as(eventTarget, "div");
        let DOM_hostingTD = getFirstParent_as(DOM_divHostingImage, "td");
        //console.log("DOM_hostingTD",DOM_hostingTD)
        let DOM_linkTD = DOM_hostingTD.previousSibling;
        //console.log("DOM_linkTD",DOM_linkTD)
        let DOM_link = DOM_linkTD.firstChild
        //console.log("DOM_link",DOM_link)
        let link = DOM_link.getAttribute("href"); // récupère le lien
        //console.log("link",link)
        DOM_divHostingImage.remove();
        DOM_hostingTD.append(createStateDiv(link));
    }
    function copieTarget(eventTarget){ // supprime l'état actuel, copie le lien et recherche le nouvel etat (copié)
        let DOM_divHostingImage = getFirstParent_as(eventTarget, "div");
        let DOM_hostingTD = getFirstParent_as(DOM_divHostingImage, "td");
        //console.log("DOM_hostingTD",DOM_hostingTD)
        let DOM_linkTD = DOM_hostingTD.previousElementSibling;
        //console.log("DOM_linkTD",DOM_linkTD)
        let DOM_link = DOM_linkTD.firstChild
        //console.log("DOM_link",DOM_link)
        let link = DOM_link.getAttribute("href"); // récupère le lien
        //console.log("link",link)
        DOM_divHostingImage.remove();
        updateClipboard(link);
        DOM_hostingTD.append(createStateDiv(link, true));
    }

    function createRow(dictIn, header, toAppend, isHeader=false){
        let DOMrow=document.createElement("tr");
            DOMrow.style.height="10px";
        toAppend.appendChild(DOMrow);
        for(let i=0;i<header.length;i++){
            if(header[i] == getOGlinkKey()){continue} // on affiche pas le OG link
            let DOMcell = document.createElement(isHeader?"th":"td");
            if(isHeader){
                DOMcell.innerText = header[i];
            }else{
                DOMcell.innerHTML = getterFormFilter(header[i])(dictIn, true);
            }
            DOMrow.appendChild(DOMcell);
        }
        //console.log("xxx")
        // ajout du bouton de chargement
        let DOMcell_loading = document.createElement(isHeader?"th":"td");
        if(isHeader){
            DOMcell_loading.innerText = "state";
            DOMcell_loading.title = "Les statut : chargement jaune (iframe dissimulée), chargement bleu (iframe affichée), X rouge (erreur), v vert (réussite, cliquer pour copier)"
        }else{
            let DOM_item=createStateDiv(getLienFromDict(dictIn, false));
        //console.log(DOM_item)
            DOMcell_loading.appendChild(DOM_item) ;
        }
        DOMrow.appendChild(DOMcell_loading);

        // ajout du bouton supprimer la valeur du stockage
        let DOMcell_delete = document.createElement(isHeader?"th":"td");
        if(isHeader){
            DOMcell_delete.innerText = "Supprimer du stockage";
            DOMcell_delete.title = "En cliquant içi vous pouvez supprimer toute les valeurs de toute la colonne affichée"
            DOMcell_delete.style.cursor="pointer";
            DOMcell_delete.addEventListener("click", (event)=>removeLinkFromStorage_fromEvent(event.target)); // demandera une confiramtion si link est manquant
        }else{
            let DOM_div = getDiv_as_fitImageContainer()
            let DOM_btn=getIMG("delete")
            DOM_btn.style.cursor="pointer";
            DOM_btn.style.paddingLeft="5px";
            DOM_btn.setAttribute("link",getLienFromDict(dictIn, false));
            DOM_btn.addEventListener("click", (event)=>removeLinkFromStorage_fromEvent(event.target));
            DOM_div.appendChild(DOM_btn) ;
            DOM_div = addAltAttributeTo_Div_as_fitImageContaine(DOM_div)
            DOMcell_delete.appendChild(DOM_div) ;
        }
        DOMrow.appendChild(DOMcell_delete);


    }
    function updateTableFromList_of_Dict(listDict, toAppend){
        // récupération des entetes
        let keys=[];
        if(listDict.length>0){
            keys=Object.keys(listDict[0]);
            createRow({}, keys, toAppend, true);
        }
        for(let i=0;i<listDict.length;i++){
            createRow(listDict[i], keys, toAppend, false);
        }
    }
    function wipeChild(DOM_in){
        try{
            while(true){
                let child = DOM_in.firstChild;
                child.remove();
            }
        }catch{};
    }
    function makeTable_From_lstDict(lstDict_links = [], DOM_prepend=null, filterOn="host", filter=""){// fonction qui cree la table
        let DOMtable;
        // vérification si la table existe déjà
        try{
            DOMtable = document.getElementById(gbl_TableID);
            if(DOMtable==null || ! DOMtable){
                throw new Error('[makeTable_From_lstDict] table non trouvée');
            }else{ // le tableau existe deja on le refait
                console.log("[makeTable_From_lstDict]On refait le tableau");
            }
        }catch{ // le tableau n'éxiste pas encore
            gbl_lstDict = lstDict_links;
            if(DOM_prepend){
                DOMtable = createDivOut(lstDict_links, DOM_prepend);
            }else{
                return false;
            }
        }
        // on filtre
        let lstDict_links_filtered = getDictLink_filtered(filterOn, filter);

        // tableau existant, on supprme ses enfants
        wipeChild(DOMtable);

        // on cree le tableau en respectant l'ordre des keys
        //console.log("to display",lstDict_links_filtered)
        updateTableFromList_of_Dict(lstDict_links_filtered, DOMtable);


    }
    function updateTable(filter){ // fonction qui met à jour la table des resultats
        makeTable_From_lstDict([], null, "host", filter=filter);
    }
    function get_custom_table(){ // fonction qui retourne le tableau où sont les liens
        let DOM_table, tableID = "DDLLinks";
        try{//récupération via l'ID de la table
            DOM_table = document.getElementById(tableID);
        }catch (error){
            console.error("[get_custom_table]",error.message)
        }
        return DOM_table;
    }
    function get_custom_tableRows(DOM_table){ // retourne les ligne de la table
        let lst_DOM_rows;
        try{
            lst_DOM_rows = DOM_table.querySelectorAll("tr");
        }catch(error){
            console.error("[get_custom_tableRows]",error.message)
            lst_DOM_rows = [];
        }
        return lst_DOM_rows;
    }

    // RECUPERATION DES LIENS DE TELECHARGEMENTS     ###################################################
    /* le type de tableau à extraire des sites :
        [{titre:<titre>, host:<site de telechargement>, size:<taille>, lien:<lien>}...]
    */

    // systeme anti pub : copié de https://greasyfork.org/fr/scripts/465783-wawacity-dl-protect-direct-download-link
    let _deleteDivCompte = 0;
    let _intervalDiv=null;
    let _deletePopupCompte = 0;
    let _intervalPopup=null;
    function deleteDiv(){ // fonction qui supprime les pubs intempestives
        //console.log('deleteDiv()', _deleteDivCompte);

        const body = document.body;
        const events = ['click', 'mousedown', 'mouseup', 'keydown', 'keyup', 'mousemove', 'mouseenter', 'mouseleave'];
        events.forEach((event) => {
            body.removeEventListener(event, body[event]);
        });

        if ( document.querySelector('div[id="dontfoid"]') != null )
        {
            //console.log('deleteDiv() => found => delete')
            document.querySelector('div[id="dontfoid"]')?.remove();
            document.querySelector('#iframe-manager')?.remove();
            document.querySelector('#alert-manager')?.remove();
            document.querySelector('iframe')?.remove();
            clearInterval(_intervalPopup);
        }

        if ( _deleteDivCompte > 300 )
        {
            clearInterval(_intervalDiv);
        }

        _deleteDivCompte++;
    }
    function intervalWatchWawaCityClickEvents(){
        _intervalDiv = setInterval(function(){
            deleteDiv();
        }, 1000);
    }
    function deletePopup(){
        // console.log('deletePopup()');

        const body = document.body;
        const events = ['click', 'mousedown', 'mouseup', 'keydown', 'keyup', 'mousemove', 'mouseenter', 'mouseleave'];
        events.forEach((event) => {
            body.removeEventListener(event, body[event]);
        });

        // console.log('deletePopup() a[dontfo] null : ', (document.querySelector('a[dontfo]') == null))
        if ( document.querySelector('a[dontfo]') != null )
        {
            // console.log('deletePopup() delete')
            document.querySelector('a[dontfo]')?.remove();
            document.querySelector('a[donto]')?.remove();
            document.querySelector('iframe:not([src]')?.nextElementSibling?.remove();
            document.querySelector('iframe:not([src]')?.remove();
            clearInterval(_intervalPopup);
        }

        if ( _deletePopupCompte > 300 )
        {
            clearInterval(_intervalPopup);
        }

        _deletePopupCompte++;
    }
    function intervalWatchDLprotectPopUps(){

        _intervalPopup = setInterval(function(){
            deletePopup();
        }, 10);
    }
    // fin systeme antipub copié de https://greasyfork.org/fr/scripts/465783-wawacity-dl-protect-direct-download-link

    var loop_overPopUpClick_interval; //  ne semble pas fonctionner
    function deactivatePopUpClick(elementID){
        loop_overPopUpClick_interval = setInterval(function () {
            try{
                document.getElementById(elementID).remove();
                console.log("[deactivatePopUpClick]",elementID,"removed");
            }catch{}
        }, 500);
        intervalWatchWawaCityClickEvents(); // créé à partir du code de https://greasyfork.org/fr/scripts/465783-wawacity-dl-protect-direct-download-link
    }

    // WAWA CITY
    function get_wawacity_DOM_to_prepend(){// en début de quel objet ajouter le tableau des resultats
        let DOMtoReturn, DOMqueryAll;
        try{
            DOMqueryAll = document.querySelectorAll(".wa-block-body");
            for(let i=0;i<DOMqueryAll.length;i++){
                DOMtoReturn = DOMqueryAll[0];
            }
        }catch(error){
            DOMtoReturn = document.querySelector("body");
        }
        return DOMtoReturn;
    }
    function get_wawacity_dict_link(DOM_tr, titre="", lienIndex=0, hostindex=1, sizeIndex=2){// fonction qui retourne un dictionnaire representant un lien complet
        let dictOut={}, host="", size="", lien="";
        let DOMlien, DOMlien_a;
        try{
            let DOM_tds = DOM_tr.querySelectorAll("td");
            if(DOM_tds.length>=lienIndex){
                DOMlien=DOM_tds[lienIndex];
                try{
                    DOMlien_a = DOMlien.querySelector("a");
                    lien = DOMlien_a.href;
                }catch(error){console.error("[get_wawacity_dict_link]",error.message)}
            }
            if(DOM_tds.length>=hostindex){host=DOM_tds[hostindex].innerText;}
            if(DOM_tds.length>=sizeIndex){size=DOM_tds[sizeIndex].innerText;}
            // vérification de sécurité
            if(host+""+size+""+lien == "" || host=="Anonyme"){return false;} // permet de pas creer le dict si 0 champs trouvé ou si lien premium
            // création du dictionnaire
            dictOut=makeDictLink(titre, host, size, lien);
        }catch(error){
            console.error("[get_wawacity_dict_link]",error.message)
        }
        return dictOut;
    }
    function get_wawacity_titre(DOM_tr){ // fonction qui transforme le titre
        let titre = DOM_tr.innerText;
        try{
            titre = titre.split('\n')[0];
        }catch{}
        return titre;
    }
    function getLinks_wawacity(){ // fonction qui extrait la liste des liens
        let DOM_table = get_custom_table();
        let lst_DOM_rows = get_custom_tableRows(DOM_table);
        let lst_dict_liens=[], dictLink, DOM_tr, titre="";
        // 2024.02.27 ligne impaire : titre, paire liens
        for(let i=0;i<lst_DOM_rows.length;i++){
            DOM_tr = lst_DOM_rows[i];
            if (DOM_tr.classList.contains('link-row')) {// contient des liens
                dictLink = get_wawacity_dict_link(DOM_tr, titre);
                if(dictLink==false){continue;}
                lst_dict_liens.push(dictLink);
            }else if(DOM_tr.classList.contains('title')){ // c'est un titre
                titre = get_wawacity_titre(DOM_tr);
            }
        }
        return lst_dict_liens;
    }
    function deactivatePopUpClick_wawacity(){deactivatePopUpClick("dontfoid");}

    // EXTREME DOWN
    function get_extremDown_DOM_to_prepend(){// en début de quel objet ajouter le tableau des resultats
        let DOMtoReturn, DOMqueryAll;
        try{
            DOMqueryAll = document.querySelectorAll(".prez_2");
            for(let i=0;i<DOMqueryAll.length;i++){
                DOMtoReturn = DOMqueryAll[0];
            }
        }catch(error){
            DOMtoReturn = document.querySelector("body");
        }
        return DOMtoReturn;
    }
    function get_extremDown_dict_link(DOM_div, titre=""){// fonction qui retourne un dictionnaire representant un lien complet
        let lst_dictLink = [], dictOut, host="", size="", lien="";
        let DOMlien_lst_a, DOMlien_a;


        try{
            DOMlien_lst_a = DOM_div.querySelectorAll("a");
            for(let i=0;i<DOMlien_lst_a.length;i++){
                DOMlien_a = DOMlien_lst_a[i];
                lien = DOMlien_a.href;
                host = DOMlien_a.innerText.split(" - ")[0];
                dictOut=makeDictLink(titre, host, size, lien);
                lst_dictLink.push(dictOut);
            }
        }catch(error){console.error("[get_extremDown_dict_link]",error.message)}

        return lst_dictLink;
    }
    function get_extremDown_titre(DOM_div){ // fonction qui transforme le titre
        let titre = DOM_div.innerText;
        try{
            titre = titre.split('\n')[0];
        }catch{}
        return titre;
    }
    function getLinks_extremDown(){ // fonction qui extrait la liste des liens
        let DOM_container = document.getElementsByClassName("blockcontent");
        let lst_DOM_divs = DOM_container[0].querySelectorAll("div");
        let lst_dict_liens=[], lst_dictLink, DOM_div, titre="";
        // 2024.02.27 div paire : titre, impaire liens
        for(let i=0;i<lst_DOM_divs.length;i++){
            DOM_div = lst_DOM_divs[i];
            if (DOM_div.classList.length==0) {// contient des liens
                lst_dictLink = get_extremDown_dict_link(DOM_div, titre);
                if(lst_dictLink.length<=0){continue;}
                lst_dict_liens = lst_dict_liens.concat(lst_dictLink);
            }else if(DOM_div.classList.contains('prez_7')){ // c'est un titre
                titre = get_extremDown_titre(DOM_div);
            }
        }
        return lst_dict_liens;
    }
    function deactivatePopUpClick_extremDown(){deactivatePopUpClick("dontfoid");}


    // ZONE TELECHARGEMENT
    function get_zoneTelechargement_DOM_to_prepend(){// en début de quel objet ajouter le tableau des resultats
        let DOMtoReturn, DOMqueryAll_coprs, DOM_tempDiv;
        try{
            DOMqueryAll_coprs = document.querySelectorAll(".corps");
            for(let i=0;i<DOMqueryAll_coprs.length;i++){
                DOMtoReturn = DOMqueryAll_coprs[0].children[1];
                DOM_tempDiv = document.createElement("div");
                DOMtoReturn.after(DOM_tempDiv);
                DOMtoReturn = DOM_tempDiv;
            }
        }catch(error){
            DOMtoReturn = document.querySelector("body");
        }
        return DOMtoReturn;
    }
    function get_zoneTelechargement_dict_link(DOM_div, host=""){// fonction qui retourne un dictionnaire representant un lien complet
        let lst_dictLink = [], dictOut, size="", titre="", lien="";
        let DOMlien_lst_a, DOMlien_a;

        try{
            DOMlien_lst_a = DOM_div.querySelectorAll("a");
            for(let i=0;i<DOMlien_lst_a.length;i++){
                DOMlien_a = DOMlien_lst_a[i];
                lien = DOMlien_a.href;
                titre = DOMlien_a.innerText;
                dictOut=makeDictLink(titre, host, size, lien);
                lst_dictLink.push(dictOut);
            }
        }catch(error){console.error("[get_zoneTelechargement_dict_link]",error.message)}

        return lst_dictLink;
    }
    function getLinks_zoneTelechargement(){ // fonction qui extrait la liste des liens
        let DOM_container = document.getElementsByClassName("postinfo");
        let lst_DOM_bs = DOM_container[0].querySelectorAll("b");
        let lst_dict_liens=[], lst_dictLink, DOM_b, titre="", DOM_innerA, host;
        // 2024.02.27 div paire : titre, impaire liens
        for(let i=0;i<lst_DOM_bs.length;i++){
            DOM_b = lst_DOM_bs[i];
            titre = DOM_b.innerText; // peut aussi être le Host
            try{
                DOM_innerA = DOM_b.querySelectorAll("a");
                if(DOM_innerA.length<=0){throw new Error("[getLinks_zoneTelechargement] Pas de lien trouvé, c'est un hébergeur");}
            }catch{ // il n'y a pas de lien donc c'est l'hébergeur
                host=titre;
                continue;
            }
            lst_dictLink = get_zoneTelechargement_dict_link(DOM_b, host);
            if(lst_dictLink.length<=0){continue;}
            lst_dict_liens = lst_dict_liens.concat(lst_dictLink);
        }
        //console.log("[getLinks_zoneTelechargement]",lst_dict_liens);
        return lst_dict_liens;
    }
    function deactivatePopUpClick_zoneTelechargement(){deactivatePopUpClick("dontfoid");}


    // DARKINO (liste)
    function get_DARKINO_DOM_to_prepend(){// en début de quel objet ajouter le tableau des resultats
        let DOMtoReturn, DOMqueryAll_coprs, DOM_tempDiv;
        try{
            DOMqueryAll_coprs = document.querySelectorAll(".mt-4");
            for(let i=0;i<DOMqueryAll_coprs.length;i++){
                DOMtoReturn = DOMqueryAll_coprs[i];
                if(DOMtoReturn.classList.length<=1){ // on cherche a ecrire sous la description
                    break;
                }
            }
        }catch(error){
            DOMtoReturn = document.querySelector("body");
        }
        return DOMtoReturn;
    }
    function DARKINO_getContentDiv(){
        let DOM_div_tables = null;
        try{
            DOM_div_tables = document.getElementsByClassName("flex-1 text-sm")[0].children; // récupère les divs
        }catch(error){
            console.error("[DARKINO_getContentDiv] ERROR",error);
        }
        return DOM_div_tables;
    }

    function DARKIWORLD_getContentDiv(){
        let className="flex-1 text-sm";

        let DOM_div_tables = null;
        try{
            let doc=DARKIWORLD_getDownload_document()
            let lst_DOMobjects=doc.getElementsByClassName(className);
            console.log("[DARKIWORLD_getContentDiv]",lst_DOMobjects);
            DOM_div_tables = lst_DOMobjects[0].children; // récupère les divs;
        }catch(error){
            console.error("[DARKIWORLD_getContentDiv] ERROR",error);
        }
        return DOM_div_tables;
    }

    function DARKINO_get_attributeName_conteningHostName(){return "x-show";}
    function DARKINO_extract_HostName(DOM_div_table){ // fonction qui extrait le nom du hostname depuis un attribut particulier
        let hostName = "";
        let attributeWithName = DARKINO_get_attributeName_conteningHostName();
        let regEx_extractHostName = /(?<=('))(.*?)(?=('))/g;
        if(DOM_div_table.hasAttribute(attributeWithName)){
            hostName = DOM_div_table.getAttribute(attributeWithName);
            let extract = regEx_extractHostName.exec(hostName);
            hostName = extract[0];
        }
        return hostName;

    }
    function DARKINO_getHostsName(){ // fonction qui extrait les hostnames possibles
        let lst_hostName = [];
        let attributeWithName = DARKINO_get_attributeName_conteningHostName();
        let regEx_extractHostName = /(?<=('))(.*?)(?=('))/g;
        try{
            let DOM_div_tables = DARKINO_getContentDiv(); // récupère les divs
            for(let i=0;i<DOM_div_tables.length;i++){
                let DOM_div_table = DOM_div_tables[i];
                let hostName = DARKINO_extract_HostName(DOM_div_table)
                if(hostName){
                    lst_hostName.push(hostName);
                }
            }
        }catch{}
        return lst_hostName;
    }
    function DARKIWORLD_getHostsName(){ // fonction qui extrait les hostnames possibles
        let lst_hostName = [];
        let attributeWithName = DARKINO_get_attributeName_conteningHostName();
        let regEx_extractHostName = /(?<=('))(.*?)(?=('))/g;
        try{
            let DOM_div_tables = DARKIWORLD_getContentDiv(); // récupère les divs
            for(let i=0;i<DOM_div_tables.length;i++){
                let DOM_div_table = DOM_div_tables[i];
                let hostName = DARKINO_extract_HostName(DOM_div_table)
                if(hostName){
                    lst_hostName.push(hostName);
                }
            }
        }catch{}
        return lst_hostName;
    }

    function DARKINO_get_linksTable(hostName=""){ // fonction qui retourne le tableau avec les headers et les liens
        let tableClass = "fi-ta-table";
        let tableToReturn = null;
        let attributeWithName = DARKINO_get_attributeName_conteningHostName();
        try{
            let DOM_div_tables = DARKINO_getContentDiv(); // récupère les divs
            for(let i=0;i<DOM_div_tables.length;i++){
                let DOM_div_table = DOM_div_tables[i];
                let DOM_table = DOM_div_table.querySelector(`.${tableClass}`);
                if(hostName=="" && DOM_div_table.style.display != "none"){ // div affichée et pas de filtre
                    tableToReturn = DOM_table
                    break;
                }
                if(DOM_div_table.hasAttribute(attributeWithName)){
                    let actualHostName = DARKINO_extract_HostName(DOM_div_table)
                    if(actualHostName.includes(hostName)){
                        tableToReturn = DOM_table;
                        break;
                    }
                }
            }
        }catch{}
        return tableToReturn;
    }
    function DARKIWORLD_get_linksTable(hostName=""){ // fonction qui retourne le tableau avec les headers et les liens
        let tableClass = "fi-ta-table";
        let tableToReturn = null;
        let attributeWithName = DARKINO_get_attributeName_conteningHostName();
        try{
            let DOM_div_tables = DARKIWORLD_getContentDiv(); // récupère les divs
            for(let i=0;i<DOM_div_tables.length;i++){
                let DOM_div_table = DOM_div_tables[i];
                let DOM_table = DOM_div_table.querySelector(`.${tableClass}`);
                if(hostName=="" && DOM_div_table.style.display != "none"){ // div affichée et pas de filtre
                    tableToReturn = DOM_table
                    break;
                }
                if(DOM_div_table.hasAttribute(attributeWithName)){
                    let actualHostName = DARKINO_extract_HostName(DOM_div_table)
                    if(actualHostName.includes(hostName)){
                        tableToReturn = DOM_table;
                        break;
                    }
                }
            }
        }catch{}
        return tableToReturn;
    }
    function DARKINO_get_headerList(DOM_table){ // fonction qui retourne les entetes tu tableau
        let headers = [];
        try{
            let DOM_headers = DOM_table.querySelector("thead");
            let DOM_headers_th = DOM_headers.querySelectorAll("th");
            for(let i=0;i<DOM_headers_th.length;i++){
                let header = DOM_headers_th[i].innerText;
                // nettoyage du header
                header = header.replace(/\n/g,"");
                header = header.trim();
                headers.push(header);
            }
        }catch (error){
            console.error("[DARKINO_get_headerList] error #1",error);
        }
        return headers;
    }
    function DARKINO_get_rows(DOM_table){ // fonction qui retourne les entetes tu tableau
        let DOM_rows = [];
        try{
            let DOM_tbody = DOM_table.querySelector("tbody");
            DOM_rows = DOM_tbody.querySelectorAll("tr");
        }catch{}
        return DOM_rows;
    }
    function DARKINO_getLink_from_td(td){
        let aClassList = "fi-link group/link relative inline-flex items-center justify-center outline-none fi-size-sm fi-link-size-sm gap-1 fi-color-gray fi-ac-action fi-ac-link-action";
        let aClass = "fi-link";
        let link = undefined;
        try{
            let a = td.querySelector("a");
            link = a.href;
        }catch(error){
            console.error("[DARKINO_getLink_from_td] ERROR # 1:",error);
        }
        return link
    }
    function getLinks_DARKINO_dedicated(hostName=""){ // fonction qui extrait la liste des liens // doit au moins
        let DOM_table = DARKINO_get_linksTable(hostName);
        let headers = DARKINO_get_headerList(DOM_table); // récupération des entetes
        let lst_DOM_rows = DARKINO_get_rows(DOM_table); // récupération des lignes de telechargement

        let lst_dict_liens=[], dictLink, DOM_tr, DOM_tds, titre="";
        // 2024.04.06 headers = ["ID", "Episode", "taille", "Qualité", "Language", "Sub", "Uploader", "Date", ""] ; ""=>links
        let index_Episode, index_taille, index_Qualite, index_Language, index_Sub, index_links, maxIndex;
        try{
            index_Episode = headers.indexOf('Episode'); // facultatif
            index_taille = headers.indexOf('taille');
            index_Qualite = headers.indexOf('Qualité');
            index_Language = headers.indexOf('Language');
            index_Sub = headers.indexOf('Sub');
            index_links = headers.length-1; // c'est le dernier element

            maxIndex = index_links;
            if(Math.min(index_taille, index_Qualite, index_Language, index_Sub, index_links, maxIndex)<0){
                let TextError=`index_Episode=${index_Episode}`;
                TextError=`${TextError}\n index_taille=${index_taille}`;
                TextError=`${TextError}\n index_Qualite=${index_Qualite}`;
                TextError=`${TextError}\n index_Language=${index_Language}`;
                TextError=`${TextError}\n index_Sub=${index_Sub}`;
                TextError=`${TextError}\n index_links=${index_links}`;
                TextError=`${TextError}\n maxIndex=${maxIndex}`;
                throw new Error(`L'un des index n'est pas passé:\n${TextError}`);
            }
        }catch(error){ // affiche un message d'erreur car on ne peut pas continuer comme ca
            console.error("[getLinks_DARKINO_dedicated] ERROR # 1:",error);
            //window.alert("[getLinks_DARKINO_dedicated] La récupération des liens ne se passe pas comme prévu,\n veuillez contacter Cyrilyxe (https://greasyfork.org/fr/users/1267775-cyrilyxe)\ mentionnez une URL ou l'erreur s'est produite");
            return lst_dict_liens;
        }
        // makeDictLink(titre=<Episode> - <Qualité> - <Language> - <Sub>, host=<Qualité>, size=<taille>, lien=links){

        for(let i=0;i<lst_DOM_rows.length;i++){
            DOM_tr = lst_DOM_rows[i];
            try{
                DOM_tds = DOM_tr.querySelectorAll("td");
                if(DOM_tds.length<maxIndex){ //on ne peut pas traiter cette ligne sans erreur
                    throw new Error(`La ligne n'a pas d'éléments : ligne ${i}: colonnemax=${DOM_tds.length-1} ; indexMax=${maxIndex}`);
                }
                let episode="";
                let episodeText = "";
                if(index_Episode>=0){ // facultatif
                    let episode = DOM_tds[index_Episode].innerText;
                    episodeText = `${episode} : `
                } // facultatif
                let taille = DOM_tds[index_taille].innerText;
                let qualite = DOM_tds[index_Qualite].innerText;
                if(hostName!=""){
                    qualite = `${hostName} - ${qualite}`
                }
                let language = DOM_tds[index_Language].innerText;
                let sub = DOM_tds[index_Sub].innerText;
                let links = DARKINO_getLink_from_td(DOM_tds[index_links]);

                let titre = `${episodeText}v_${language}/s_${sub}` ; //Episode> - <Language> - <Sub>
                dictLink = makeDictLink(titre, qualite, taille, links);
                lst_dict_liens.push(dictLink);
            }catch (error){
                console.error("[getLinks_DARKINO_dedicated] ERROR #2:", error);
            }
        }
        return lst_dict_liens;
    }
    function getLinks_DARKIWORLD_dedicated(hostName=""){ // fonction qui extrait la liste des liens // doit au moins
        let DOM_table = DARKIWORLD_get_linksTable(hostName);
        let headers = DARKINO_get_headerList(DOM_table); // récupération des entetes
        let lst_DOM_rows = DARKINO_get_rows(DOM_table); // récupération des lignes de telechargement

        let lst_dict_liens=[], dictLink, DOM_tr, DOM_tds, titre="";
        // 2024.04.06 headers = ["ID", "Episode", "taille", "Qualité", "Language", "Sub", "Uploader", "Date", ""] ; ""=>links
        let index_Episode, index_taille, index_Qualite, index_Language, index_Sub, index_links, maxIndex;
        try{
            index_Episode = headers.indexOf('Episode'); // facultatif
            index_taille = headers.indexOf('taille');
            index_Qualite = headers.indexOf('Qualité');
            index_Language = headers.indexOf('Language');
            index_Sub = headers.indexOf('Sub');
            index_links = headers.length-1; // c'est le dernier element

            maxIndex = index_links;
            if(Math.min(index_taille, index_Qualite, index_Language, index_Sub, index_links, maxIndex)<0){
                let TextError=`index_Episode=${index_Episode}`;
                TextError=`${TextError}\n index_taille=${index_taille}`;
                TextError=`${TextError}\n index_Qualite=${index_Qualite}`;
                TextError=`${TextError}\n index_Language=${index_Language}`;
                TextError=`${TextError}\n index_Sub=${index_Sub}`;
                TextError=`${TextError}\n index_links=${index_links}`;
                TextError=`${TextError}\n maxIndex=${maxIndex}`;
                throw new Error(`L'un des index n'est pas passé:\n${TextError}`);
            }
        }catch(error){ // affiche un message d'erreur car on ne peut pas continuer comme ca
            console.error("[getLinks_DARKIWORLD_dedicated] ERROR # 1:",error);
            //window.alert("[getLinks_DARKIWORLD_dedicated] La récupération des liens ne se passe pas comme prévu,\n veuillez contacter Cyrilyxe (https://greasyfork.org/fr/users/1267775-cyrilyxe)\ mentionnez une URL ou l'erreur s'est produite");
            return lst_dict_liens;
        }
        // makeDictLink(titre=<Episode> - <Qualité> - <Language> - <Sub>, host=<Qualité>, size=<taille>, lien=links){

        for(let i=0;i<lst_DOM_rows.length;i++){
            DOM_tr = lst_DOM_rows[i];
            try{
                DOM_tds = DOM_tr.querySelectorAll("td");
                if(DOM_tds.length<maxIndex){ //on ne peut pas traiter cette ligne sans erreur
                    throw new Error(`La ligne n'a pas d'éléments : ligne ${i}: colonnemax=${DOM_tds.length-1} ; indexMax=${maxIndex}`);
                }
                let episode="";
                let episodeText = "";
                if(index_Episode>=0){ // facultatif
                    let episode = DOM_tds[index_Episode].innerText;
                    episodeText = `${episode} : `
                } // facultatif
                let taille = DOM_tds[index_taille].innerText;
                let qualite = DOM_tds[index_Qualite].innerText;
                if(hostName!=""){
                    qualite = `${hostName} - ${qualite}`
                }
                let language = DOM_tds[index_Language].innerText;
                let sub = DOM_tds[index_Sub].innerText;
                let links = DARKINO_getLink_from_td(DOM_tds[index_links]);

                let titre = `${episodeText}v_${language}/s_${sub}` ; //Episode> - <Language> - <Sub>
                dictLink = makeDictLink(titre, qualite, taille, links);
                lst_dict_liens.push(dictLink);
            }catch (error){
                console.error("[getLinks_DARKIWORLD_dedicated] ERROR #2:", error);
            }
        }
        return lst_dict_liens;
    }
    function getLinks_DARKINO_all(){
        let lst_hostName = DARKINO_getHostsName();
        let lst_dict_liens = [];
        for(let i=0;i<lst_hostName.length;i++){
            let hostName = lst_hostName[i];
            lst_dict_liens.push(...getLinks_DARKINO_dedicated(hostName)); // extend lst_dict_liens
        }
        return lst_dict_liens;
    }
    function getLinks_DARKIWORLD_all(){
        console.log("[getLinks_DARKIWORLD_all]")
        let lst_hostName = DARKIWORLD_getHostsName();
        console.log("[getLinks_DARKIWORLD_all]lst_hostName=",lst_hostName)
        let lst_dict_liens = [];
        for(let i=0;i<lst_hostName.length;i++){
            let hostName = lst_hostName[i];
            lst_dict_liens.push(...getLinks_DARKIWORLD_dedicated(hostName)); // extend lst_dict_liens
        }
        return lst_dict_liens;
    }
    async function DARKINO_clearFilters(){ // and DARKIWORLD
        let classFilters = "fi-badge-delete-button";//"choices__button";
        return await new Promise(resolve => {
            const interval = setInterval(async () => {
                let DOM_buttonsCloseFilter;
                do{
                    DOM_buttonsCloseFilter = document.getElementsByClassName(classFilters);
                    console.log("lst",DOM_buttonsCloseFilter);
                    if(DOM_buttonsCloseFilter.length>0){
                        let DOM_buttonCloseFilter = DOM_buttonsCloseFilter[DOM_buttonsCloseFilter.length-1]
                        DOM_buttonCloseFilter.click();
                        //console.log("DOM_buttonCloseFilter",DOM_buttonCloseFilter);
                        await new Promise(r => setTimeout(r, 50)); // sleep
                    }
                }while(DOM_buttonsCloseFilter.length>0);
                resolve(true)
                clearInterval(interval);
            }, 500);
        });
    }
    async function DARKIWORLD_clearFilters(){ // and DARKIWORLD
        let classFilters = "fi-badge-delete-button";//"choices__button";
        return await new Promise(resolve => {
            const interval = setInterval(async () => {
                let DOM_buttonsCloseFilter;
                do{
                    let lst_shadows = listShadowObjects(false);
                    DOM_buttonsCloseFilter = getElementsByClassName(classFilters, document, lst_shadows);
                    console.log("lst",DOM_buttonsCloseFilter);
                    if(DOM_buttonsCloseFilter.length>0){
                        let DOM_buttonCloseFilter = DOM_buttonsCloseFilter[DOM_buttonsCloseFilter.length-1]
                        DOM_buttonCloseFilter.click();
                        //console.log("DOM_buttonCloseFilter",DOM_buttonCloseFilter);
                        await new Promise(r => setTimeout(r, 50)); // sleep
                    }
                }while(DOM_buttonsCloseFilter.length>0);
                resolve(true)
                clearInterval(interval);
            }, 500);
        });
    }
    async function DARKINO_waitForSelects(){ // and DARKIWORLD
        //console.log("DARKINO_waitForSelects")
        let classSelect = "fi-select-input";
        return await new Promise(resolve => {
            const interval = setInterval(() => {
                let DOM_selects = document.getElementsByClassName(classSelect);
                if(DOM_selects.length>0){
                    resolve(DOM_selects);
                    clearInterval(interval);
                };
            }, 1000);
        });
    }
    function DARKIWORLD_getDownload_iframe(){
        let iframe=null
        try{
            iframe=document.getElementById("iframe-livewire");
        }catch{}
        return iframe;
    }
    function DARKIWORLD_getDownload_document(defaultDoc=document){
        let doc = defaultDoc;
        try{
            let iframe=DARKIWORLD_getDownload_iframe();
            doc=iframe.contentWindow.document
        }catch{}
        return doc;
    }
    async function DARKIWORLD_waitForSelects(){ // and DARKIWORLD
        //console.log("DARKIWORLD_waitForSelects")
        return await new Promise(resolve => {
            const interval = setInterval(() => {
                let classSelect = "fi-select-input";
                let lst_shadows = listShadowObjects(false);
                let doc=DARKIWORLD_getDownload_document();
                let DOM_selects=doc.getElementsByClassName(classSelect);
                if(DOM_selects.length>0){
                    resolve(DOM_selects);
                    clearInterval(interval);
                };
            }, 1000);
        });
    }
    async function DARKINO_selectOK(DOMselect, selectExpectedValue){ // and DARKIWORLD
        return await new Promise(resolve => {
            const interval = setInterval(() => {
                let DOMselectValue = DOMselect.value;
                if(DOMselectValue==selectExpectedValue){
                    resolve(true);
                    clearInterval(interval);
                };
            }, 1000);
        });
    }

    async function displayAllTableLines(){ // affichage de tous les lignes du tableau hébergeant les liens
        //console.log("displayAllTableLines")
        await DARKINO_clearFilters();
            console.log("xxx 1.2");
        return new Promise(async function(resolve){
            // déclaration des variables
            let DOM_selects;

            try{

                DOM_selects = await DARKINO_waitForSelects();

                let option="all"
                for(let i=0;i<DOM_selects.length;i++){
                    let DOM_select = DOM_selects[i];
                    let DOM_options = DOM_select.querySelectorAll("option");
                    let hasOption = false;
                    let DOMoption_found = null;
                    for(let j=0;j<DOM_options.length;j++){
                        let DOM_option = DOM_options[j];
                        if(DOM_option.value == option){
                            DOMoption_found = DOM_option;
                            hasOption = true;
                        }else{
                            DOM_option.removeAttribute("selected");
                        }
                    }
                    if(hasOption){
                        DOMoption_found.setAttribute("selected", 'selected');
                        // Create a new 'change' event
                        var event = new Event('change');

                        // Dispatch it.
                        DOM_select.value = option;
                        DOM_select.dispatchEvent(event);

                        let attendons_que = await DARKINO_selectOK(DOM_select, option)
                        }
                }
                resolve(true);

            }catch(error){
                console.error("[displayAllTableLines] ERROR #1:",error);
            }
        });
    }

    async function DARKIWORLD_displayAllTableLines(){ // affichage de tous les lignes du tableau hébergeant les liens
        //console.log("displayAllTableLines")
        await DARKIWORLD_clearFilters();
        return new Promise(async function(resolve){
            // déclaration des variables
            let DOM_selects;

            try{

                DOM_selects = await DARKIWORLD_waitForSelects();

                let option="all"
                for(let i=0;i<DOM_selects.length;i++){
                    let DOM_select = DOM_selects[i];
                    let DOM_options = DOM_select.querySelectorAll("option");
                    let hasOption = false;
                    let DOMoption_found = null;
                    for(let j=0;j<DOM_options.length;j++){
                        let DOM_option = DOM_options[j];
                        if(DOM_option.value == option){
                            DOMoption_found = DOM_option;
                            hasOption = true;
                        }else{
                            DOM_option.removeAttribute("selected");
                        }
                    }
                    if(hasOption){
                        DOMoption_found.setAttribute("selected", 'selected');
                        // Create a new 'change' event
                        var event = new Event('change');

                        // Dispatch it.
                        DOM_select.value = option;
                        DOM_select.dispatchEvent(event);

                        let attendons_que = await DARKINO_selectOK(DOM_select, option)
                        }
                }
                resolve(true);

            }catch(error){
                console.error("[DARKIWORLD_displayAllTableLines] ERROR #1:",error);
            }
        });
    }

    // DARKIWORLD (liste)



    // FUNCTIONS proxy link      ###################################################
    // DARKINO (DL)
    function DARKINO_DL_is_errorPage(noTwrow=false){
        // recherche de la page d'erreur
        let Lst_H1 = document.querySelectorAll("h1");
        for(let j=0;j<Lst_H1.length;j++){
            let DOM_h1 = Lst_H1[j];
            if(DOM_h1.innerText.includes("403")){
                // il y a bien une erreur
                if(noTwrow){
                    return true;
                }else{
                    throw new Error("Erreur 403 trouvée");
                }
            }
        }
        return false
    }
    function getLinkClicker_DARKINO(){ // fonction qui click sur le bouton permettant d'avoir le lien
        let DOM_lstButtons = document.querySelectorAll("button");
        for(let i=0;i<DOM_lstButtons.length;i++){
            let DOMitem = DOM_lstButtons[i];
            if(isButtonForAccessingLink(DOMitem.innerText)){
                DOMitem.click();
                break; // facultatif
            }
            DARKINO_DL_is_errorPage();
        }
    }
    function getURL_toDL_DARKINO(actualSite){ // fonction qui récupère le ou les liens
        let allDone = false;
        try{
            let DOM_lstButtons = document.querySelectorAll("button");
            for(let i=0;i<DOM_lstButtons.length;i++){
                let DOMitem = DOM_lstButtons[i];
                if(isButtonForShowingLink(DOMitem.innerText)){
                    let DOMurl = DOMitem.parentElement;
                    if(DOMurl.href.match("http")){// test de réussite
                        updateStorageWithNewLinks(actualSite, DOMurl.href);
                        allDone=true;
                        break; // facultatif
                    }

                    // recherche de la page d'erreur
                    DARKINO_DL_is_errorPage();
                }
            }
            // manque la fonction multi URLS # TODO
        }catch (error){
            console.error("[getURL_toDL_DARKINO] error 1",error.message);
            allDone=false;
        }

        return allDone;
    }

    // DL-PROTECT
    function get_dl_protect_BTN_1_ID(){return "subButton";}
    function getLinkClicker_DL_PROTECT(){ // fonction qui click sur le bouton permettant d'avoir le lien
        let itemID = get_dl_protect_BTN_1_ID();
        let DOMitem = document.getElementById(itemID);
        // méthode alternative : let DOMitem = document.querySelector('button[type="submit"]');
        if(DOMitem){
            if(isButtonForAccessingLink(DOMitem.innerText)){
                DOMitem.click();
            }
        }
    }
    function getURL_toDL_DL_PROTECT(actualSite){ // fonction qui récupère le ou les liens et retourne true si tous est terminé
        let allDone = true;
        let lstURLS = [];
        try{
            let DOMurls = document.getElementsByClassName("urls");
            //console.log(DOMurls)
            for(let i=0; i<DOMurls.length;i++){ // parcours des objets URL, testé uniquement avec 1 lien
                let DOMurl = DOMurls[i];
                if(DOMurl.innerText.match("http")){// test de réussite
                    updateStorageWithNewLinks(actualSite, DOMurl.innerText);
                    lstURLS.push(DOMurl.innerText);
                } else if(DOMurl.innerText.match(" erreur ")){ // On est sur une erreur de catcha ; 2024-04-02_v0.2.3 à tester
                    allDone = true;
                    break;
                }
            }
            if(lstURLS.length>1){ // création du stockage multi URL
                let urls = lstURLS.join(getURLSdelimiter());
                updateStorageWithNewLinks(actualSite, urls); // remplace donc "<actualSite>:<1 url>" en "<actualSite>:<multi urls>"
            }

            if(DOMurls.length>0){ // vérification que les liens se sont bien sauvegardés
                //console.log("DOMurls>0");
                for(let i=0; i<DOMurls.length;i++){
                    if(GM_getValue(actualSite)){
                        //console.log(actualSite,"OK");
                        continue
                    }else{
                        //console.log(actualSite,"NOK");
                        allDone=false;
                        console.error("[getURL_toDL_DL_PROTECT] for DEV : une erreur s'est produite, veuillez verifier")
                        //alert("[getURL_toDL_DL_PROTECT] for DEV : une erreur s'est produite, veuillez verifier")
                        break;
                    }
                }
            }else{ // aucun lien, on ne ferme pas tout de suite la page
                allDone=false;
            }
        }catch (error){
            console.error("[getURL_toDL_DL_PROTECT] error 1",error.message);
            //alert("[getURL_toDL_DL_PROTECT] error 1",error.message);
            allDone=false;
        }
        return allDone;
    }

    // ACTIONS ###################################################
    function updateStorageWithNewLinks(proxyLink, hiddenLink){ // fonction qui met à jour le stockage pour les correspondances entre les proxy et les liens qu'ils cachent
        // ajout pour proxy:url(s)
        GM_setValue(proxyLink, hiddenLink);
        // ajout de url(s) : url(s)
        GM_setValue(hiddenLink, hiddenLink);
        // ajout de url : url
        try{
            if(hiddenLink.includes(getURLSdelimiter())){
                let lstURLs = hiddenLink.split(getURLSdelimiter());
                for(let i=0;i<lstURLs.length;i++){
                    let monURL = lstURLs[i];
                    GM_setValue(monURL, monURL);
                }
            }
        }catch{}
    }

    var waitFor_BTN_1_interval, waitFor_links_interval;
    function closeWindow(){// ferme la fenetre si l'url est connue
        close();
    }

    function waitFor_BTN_1(actualSite, clickerFunction, updateLinkFunction){
        if(GM_getValue(actualSite)){
            closeWindow();
        }
        waitFor_BTN_1_interval = setInterval(function () {
            try{
                clickerFunction();
            }catch (error){
                console.error("[waitFor_BTN_1] error 1",error.message);
            }

            let allDone = updateLinkFunction(actualSite);

            if(allDone){closeWindow();}
        }, 1000);
    }


    // FIN RECUPERATION DES LIENS DE TELECHARGEMENTS           ###################################################
    async function MAIN(actualSite=window.location.href){
        let animationObject = displayLoadingOvrlayed("chargement des liens \n(warez_helper)");
        let lstDict_links = [],
            fct_get_lstDictLinks,
            fct_get_DOM_to_prepend;
        let warezSite = false;
        if(actualSite.match("wawacity")){
            warezSite = true;
            fct_get_lstDictLinks = getLinks_wawacity;
            fct_get_DOM_to_prepend = get_wawacity_DOM_to_prepend;
            deactivatePopUpClick_wawacity();
        }
        if(actualSite.match("extreme-down")){
            warezSite = true;
            fct_get_lstDictLinks = getLinks_extremDown;
            fct_get_DOM_to_prepend = get_extremDown_DOM_to_prepend;
            deactivatePopUpClick_extremDown();
        }
        if(actualSite.match("zone-telechargement")){
            warezSite = true;
            fct_get_lstDictLinks = getLinks_zoneTelechargement;
            fct_get_DOM_to_prepend = get_zoneTelechargement_DOM_to_prepend;
            deactivatePopUpClick_zoneTelechargement();
        }
        //if(actualSite.match("darkino") && ! actualSite.match("/download/") && ! actualSite.match("/post/")){closeWindow();} // c'est une erreur, on est revenu sur la page d'acceuil
        if(actualSite.match("darkino") && ! actualSite.match("/download/") && actualSite.match("/post/")){
            warezSite = true;
            await displayAllTableLines();
            fct_get_lstDictLinks = getLinks_DARKINO_all;
            fct_get_DOM_to_prepend = get_DARKINO_DOM_to_prepend;
        }

        if(actualSite.match("darkiworld") && actualSite.match("/download/")){// && ! actualSite.match("/darkiworld/") && actualSite.match("/darkiworld/")
            warezSite = true;
            await DARKIWORLD_displayAllTableLines();
            fct_get_lstDictLinks = getLinks_DARKIWORLD_all;
            fct_get_DOM_to_prepend = get_DARKINO_DOM_to_prepend;
        }


        if(warezSite){ // site qui liste les liens
            lstDict_links = fct_get_lstDictLinks();
            makeTable_From_lstDict(lstDict_links, fct_get_DOM_to_prepend());
            deleteAnimation(animationObject);
        }else{ // site qui protege les liens
            deleteAnimation(animationObject);
            let linkProxy = false;
            if(actualSite.match("dl-protect")){
                intervalWatchDLprotectPopUps(); // pour arrêter les popus // créé à partir du code de https://greasyfork.org/fr/scripts/465783-wawacity-dl-protect-direct-download-link
                linkProxy = true;
                waitFor_BTN_1(actualSite, getLinkClicker_DL_PROTECT, getURL_toDL_DL_PROTECT);
            }
            if(actualSite.match("darkino") && actualSite.match("/download/")){
                linkProxy = true;
                waitFor_BTN_1(actualSite, getLinkClicker_DARKINO, getURL_toDL_DARKINO);
            }
            if(actualSite.match("darkiworld") && actualSite.match("/download/")){
            }

        }
    }

    let gbl_lastLocation=null;
    window.addEventListener('load', function() { // lancement du script quand la page est chargée
        setInterval(function () {
            let actualLocation = window.location.href
            if(actualLocation!=gbl_lastLocation){
                gbl_lastLocation=actualLocation
                MAIN(window.location.href);
            }
        }, 1000);
    }, false);



})();