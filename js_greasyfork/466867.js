// ==UserScript==
// @name            lbaqr-anti-flood
// @namespace       http://tampermonkey.net/
// @license         MIT
// @version         0.7.2
// @description     Sur lbarq.fr (La Boîte à QR) : replie automatiquement les longues séries de questions posées les unes à la suite des autres par un même auteur.
// @description:en  On lbarq.fr (French speaking website) : automatically folds long series of questions from the same author.
// @author          Ed38
// @match           https://*.lbaqr.fr/*
// @icon            https://www.google.com/s2/favicons?sz=64&domain=lbaqr.fr
// @grant           GM_addStyle
// @grant           GM_registerMenuCommand
// @grant           GM_unregisterMenuCommand
// @grant           GM_getValue
// @grant           GM_setValue
// @run-at          document-body
// @downloadURL https://update.greasyfork.org/scripts/466867/lbaqr-anti-flood.user.js
// @updateURL https://update.greasyfork.org/scripts/466867/lbaqr-anti-flood.meta.js
// ==/UserScript==

(function () {

    'use strict';

    let defMax = 4; // Nombre maximal de questions par default avant repliage automatique.
    // Default maximum number of questions until start folding.
    let defTolerance = 0;
    const maxTolerance = 3;
    let debug = true;
    const msg_inputMax = "Nombre maximum de questions\n\nVeuillez entrer le nombre de questions au delà duquel le repliage automatique doit s'effectuer.\n\nLa page courante sera rechargée après validation.";
    const msgErr_inputMax = "La valeur attendue est un nombre entier supérieur à 0.";
    const msg_inputTolerance = "Tolérance (0-{maxTolerance})\n" +
          "Valeur recommandée : 0 ou 1.\n\n" +
          "Le repliage peut s'effectuer même si quelques questions d'autres auteurs se trouvent à l'intérieur de la série ; " +
          "la valeur de tolérance indique le nombre de questions consécutives pouvant s'intercaler (elles ne seront pas masquées).\n\n" +
          "La page courante sera rechargée après validation.";
    const msgErr_inputTolerance = "Tolérance\n\nLa valeur attendue est un nombre entier compris entre 0 et {maxTolerance}.";
    const msgErr_consistency = "Le nombre maximum de questions avant repliage doit être supérieur à la valeur de tolérance.";
    const msgResetDefaults = "Réinitialiser les paramètres à leur valeur par défaut.\n\nLa page sera rechargée après validation.";
    const msg_hide = "Masquer les {nbOfExtraQ} questions suivantes de {author}";
    const msg_show = "Afficher les {nbOfExtraQ} autres questions de {author}";
    const msg_menuMax = "Nb max ({qMax})";
    const msg_menuTolerance = "Tolérance ({tolerance})";
    const msg_menuResetDefaults = "Réinitialiser les paramètres";
    const validPage = /^https:\/\/(?:.*\.)?lbaqr\.fr\/(?:category\/.*|top\/|login\/)?$/;
    let menuMaxId;
    let menuToleranceId;
    let menuResetDefaultsId;

    let qMax = GM_getValue("qMax", null);
    if (!qMax){
        qMax = defMax;
    }
    let tolerance = GM_getValue("tolerance", null);
    if (!tolerance){
        tolerance = defTolerance;
    }

    setMenu();

    let unfoldedList = document.createElement("div");
    unfoldedList.setAttribute("id","unfoldedList");
    document.body.appendChild(unfoldedList);

    let css = `

    li.folder {
    font-size:0.9em;
    padding:6px;
    list-style-type:'▶ ';
    list-style-position:inside;
    list-style-image:url('data:image/svg+xml,%3Csvg fill="%23000000" height="12px" width="12px" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 330 330" %3E%3Cpath id="XMLID_222_" d="M250.606,154.389l-150-149.996c-5.857-5.858-15.355-5.858-21.213,0.001 c-5.857,5.858-5.857,15.355,0.001,21.213l139.393,139.39L79.393,304.394c-5.857,5.858-5.857,15.355,0.001,21.213 C82.322,328.536,86.161,330,90,330s7.678-1.464,10.607-4.394l149.999-150.004c2.814-2.813,4.394-6.628,4.394-10.606 C255,161.018,253.42,157.202,250.606,154.389z"/%3E%3C/svg%3E');
    background: linear-gradient(0deg, rgba(0,213,255,0.5) 0%, rgba(135,239,255,.5) 16%, rgba(255,255,255,0.5) 100%);
    }

    li.folderOpen{
    list-style-type:'▼ ';
    list-style-image:url('data:image/svg+xml,%3Csvg fill="%23000000" height="12px" width="12px" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 330 330" %3E%3Cpath id="XMLID_225_" d="M325.607,79.393c-5.857-5.857-15.355-5.858-21.213,0.001l-139.39,139.393L25.607,79.393 c-5.857-5.857-15.355-5.858-21.213,0.001c-5.858,5.858-5.858,15.355,0,21.213l150.004,150c2.813,2.813,6.628,4.393,10.606,4.393 s7.794-1.581,10.606-4.394l149.996-150C331.465,94.749,331.465,85.251,325.607,79.393z"/%3E%3C/svg%3E');
    background: linear-gradient(0deg, rgba(255,255,255,0.5) 00%, rgba(0,213,255,0.25) 50%, rgba(255,255,255,0.5) 100%);
    }

    li.hide{
    max-height:0px !important;
    overflow:hidden;
    padding-top: 0px !important;
    padding-bottom: 0px !important;
    border-bottom: 0px !important;
    opacity:0;
    }

    li.transition{
    transition-property: padding-top, padding-bottom, max-height, opacity;
    transition-timing-function: cubic-bezier(.05,.23,0,1);
    transition-duration: 800ms;
    }

    li.show{
    border-left:4px solid rgba(0,213,255,0.25);
    padding-left:16px !important;
    }

    ul.categoryStreamList li.folder:first-child, li.folder + li.folder {
    display: none;
    }

    `;

    GM_addStyle(css);

    // Select the node that will be observed for mutations
    let targetNode = document.body;

    // Options for the observer (which mutations to observe)
    let config = { childList: true , subtree: true};

    // Callback function to execute when mutations are observed
    let callback = function (mutationRecords) {
        if ( !validPage.test(document.location) || !mutationRecords[0].addedNodes[0] || (mutationRecords[0].addedNodes[0].nodeName != "APP-CATEGORY-STREAM-ITEM") ){
            return;
        }

        //Remove old folders.
        let waste;
        while ( ((waste=document.querySelector("ul.categoryStreamList"))) && waste.firstElementChild.classList.contains("folder") ){
            waste.firstElementChild.remove();
        }

        let questions = document.evaluate('//li[@data-author]', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null );

        let c=0;
        let author="";
        let question;
        let question1;
        let i=0;

        while ( ((question1 = questions.snapshotItem(i)))){
            c = 0;
            author = question1.dataset.author;
            i++;
            counter:{
                while ( ((question = questions.snapshotItem(i))) ) {
                    if (question.dataset.author == author ){
                        i++;
                        c++;
                    }
                    else{
                        let j=1;
                        toleranceL: {
                            while( j <= tolerance ){
                                if ( questions.snapshotItem(i+j) && questions.snapshotItem(i+j).dataset.author == author ){
                                    i = i + j + 1;
                                    c++;
                                    break toleranceL;
                                }
                                else {
                                    j++;
                                }
                            }

                            break counter;

                        }
                    }
                }
            }

            if ( c + 1 > qMax ){

                if ( question1.dataset.fnumber ) {
                    // prevously processed

                    if ( question1.dataset.fnumber == c ){
                        //nothing to do
                    }

                    else if ( question1.dataset.folded == 1 ) {
                        //new question(s) to fold";
                        question1.dataset.folded = 0;
                        question1.dataset.fnumber = c;
                        toggleQ(question1.parentNode.nextSibling.getElementsByTagName("a")[0]);
                    }
                }

                else {
                    // Create new folder
                    let newFolder = document.createElement("li");
                    newFolder.classList.add("folder");
                    let button=document.createElement("a");
                    button.addEventListener ("click", toggleQ, false)
                    newFolder.appendChild(button);
                    question1.parentNode.parentNode.insertBefore(newFolder,question1.parentNode.nextSibling);

                    if ( wasUnfolded(question1) ){
                        question1.dataset.folded = 1;
                    }

                    else {
                        question1.dataset.folded = 0;
                    }
                    question1.dataset.fnumber = c;
                    toggleQ(button);
                }
            }
        }
    };
    // Create an observer instance linked to the callback function
    let observer = new MutationObserver(callback);
    observer.observe(targetNode, config);

    // END


    // Function

    function log(m){
        if ( debug ){
            console.log(m);
        }
    }

    // Fold / Unfold
    function toggleQ(link){
        if ( link.target ){
            link = this;
        }

        let folder = link.parentNode;
        let firstQuestion = folder.previousSibling.querySelector("[data-author]");
        let nbOfExtraQ = firstQuestion.dataset.fnumber;
        let author = firstQuestion.dataset.author;
        let show;
        firstQuestion.style.borderBottom = "none";
        if (firstQuestion.dataset.folded == 1) {
            firstQuestion.dataset.folded = 0;
            link.innerHTML = varsInMsg( { "{nbOfExtraQ}": nbOfExtraQ, "{author}": author } , msg_hide) ;
            show = true;
            folder.classList.add("folderOpen");
            saveUnfolded(firstQuestion);
        }
        else{
            firstQuestion.dataset.folded = 1;
            link.innerHTML = varsInMsg( { "{nbOfExtraQ}": nbOfExtraQ, "{author}": author } , msg_show) ;
            folder.classList.remove("folderOpen")
            show = false;
            removeUnfolded(firstQuestion);
        }

        let i = 1
        let row = folder;
        let li;

        while ( i <= nbOfExtraQ ){
            row = row.nextSibling;

            if ( row.classList.contains("folder") ){
                // remove old folders (scrolling backwards)
                row = row.nextSibling;
                row.previousSibling.remove();
            }

            if( li=row.querySelector('[data-author="'+author+'"]') ){
                if( li.dataset.author && li.dataset.author==author ){
                    if (show === true){
                        li.classList.add("transition");
                        li.classList.add("show");
                        li.classList.remove("hide");
                    }
                    else{
                        li.classList.add("hide");
                        li.classList.remove("show");
                    }
                    i++;
                }
            }
        }
    }

    // Save unfolded status
    function saveUnfolded(q){
        let title = q.querySelector('[class="questionCardTitle"]');
        let storage = document.querySelector('[id="unfoldedList"');
        storage.setAttribute("data-" + hashKey(title.innerHTML),"1");
    }

    function removeUnfolded(q){
        let title = q.querySelector('[class="questionCardTitle"]');
        let storage = document.querySelector('[id="unfoldedList"');
        storage.removeAttribute("data-" + hashKey(title.innerHTML));
    }

    function wasUnfolded(q){
        let title = q.querySelector('[class="questionCardTitle"]');
        return document.querySelector('[data-' + hashKey(title.innerHTML) + '="1"]');
    }

    // An implementation of Jenkins's one-at-a-time hash
    // <http://en.wikipedia.org/wiki/Jenkins_hash_function>
    function hashKey(key) {
        var hash = 0, i = key.length;

        while (i--) {
            hash += key.charCodeAt(i);
            hash += (hash << 10);
            hash ^= (hash >> 6);
        }
        hash += (hash << 3);
        hash ^= (hash >> 11);
        hash += (hash << 15);
        return hash;
    }

    // Menu
    function setMenu(){
        if ( menuMaxId ){
            GM_unregisterMenuCommand(menuMaxId);
        }
        menuMaxId = GM_registerMenuCommand(varsInMsg({"{qMax}":qMax},msg_menuMax), setMax);

        if ( menuToleranceId ){
            GM_unregisterMenuCommand(menuToleranceId);
        }
        menuToleranceId = GM_registerMenuCommand(varsInMsg({"{tolerance}":tolerance},msg_menuTolerance), setTolerance);

        if ( menuResetDefaultsId ){
            GM_unregisterMenuCommand(menuResetDefaultsId);
        }
        menuResetDefaultsId = GM_registerMenuCommand(msg_menuResetDefaults, resetDefaults);


    }

    // Set max number of questions
    function setMax() {
        let r = window.prompt(msg_inputMax, qMax);
        if ( r ){
            if ( Number.isInteger(+r) && r>0 ){
                if ( r <= tolerance ) {
                    alert(msgErr_consistency);
                    return
                }
                qMax = r;
                GM_setValue("qMax", qMax);
                setMenu();
                location.reload();
            }
            else {
                alert(msgErr_inputMax);
            }
        }
    }

    // Set tolerance
    function setTolerance() {
        let r = window.prompt(varsInMsg({"{maxTolerance}":maxTolerance}, msg_inputTolerance), tolerance);
        if ( r ){
            if ( Number.isInteger(+r) && r>=0 && r <= maxTolerance ){

                if ( r >= qMax ) {
                    alert(msgErr_consistency);
                    return
                }
                tolerance = r;
                GM_setValue("tolerance", tolerance);
                setMenu();
                location.reload();
            }
            else {
                alert(varsInMsg({"{maxTolerance}":maxTolerance},msgErr_inputTolerance));
            }
        }
    }

    //Reset defaults
    function resetDefaults(){
        let r = confirm(msgResetDefaults) ;
        if ( r === true ) {
            GM_setValue("qMax", defMax);
            GM_setValue("tolerance", defTolerance);
            location.reload();
        }
    }

    function varsInMsg(vars,string){
        let keys = Object.keys(vars);
        for ( let k in keys){
            string = string.replaceAll(keys[k], vars[keys[k]] );
        }
        return string;
    }

})();

