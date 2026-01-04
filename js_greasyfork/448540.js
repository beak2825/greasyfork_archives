// ==UserScript==
// @name         openCTIguiImprovment
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  try to take over the world!
// @author       You
// @match        https://opencti.internet.np/dashboard/*
// @icon         https://opencti.internet.np/static/logo_text.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/448540/openCTIguiImprovment.user.js
// @updateURL https://update.greasyfork.org/scripts/448540/openCTIguiImprovment.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var listButtons, button, intervalLoad, intervalAdd, intervalMain;
    var defaultWidth="100%";
    var defaultText=( defaultWidth === "100%" ? "réduire" : "agrandir" );

    // vérification de la présence du bouton
    main();
    function main() {
        intervalMain=setInterval( async function intervalMain(){
            //console.log('intervalMain');
            await waitForLoad();
            //console.log('intervalMain apres await');
            if(getOverlayDiv() && !document.getElementById('enlargeButton')) {
                //console.log('intervalMain ajout bouton si present');
                // vérification si l'overlay est deja ouvert, si tel est le cas, ajouter le bouton
                addButtonEnlarge(getOverlayDiv());
            }else if((getOverlayDiv() && document.getElementById('enlargeButton')) || !getOverlayDiv()){
                fctclearIntervalMain();
            }
        },250);
    }

    // wait for load
    function waitForLoad(){
        var cpt=0;
        return new Promise((resolve) => {
            intervalLoad=setInterval(function intervalLoad(){
                if(!document.getElementById('enlargeButton')){
                    //console.log('interval '+(cpt++));
                    listButtons = document.querySelectorAll('button');
                    //console.log(listButtons);
                    for(var i=0;i<listButtons.length ; i++){
                        button = listButtons[i];
                        if(button.getAttribute('aria-label')){
                            if(button.getAttribute('aria-label')==='Add' || button.getAttribute('aria-label')==='Edit'){
                                //console.log('waitForLoad/intervalLoad = good button');
                                button.addEventListener('click', addCliqued);
                            }
                        }
                    }
                    //console.log('waitForLoad/intervalLoad = fin for ');
                }
                if(document.getElementById('enlargeButton')){
                    fctclearIntervalLoad();
                    resolve(true);
                }
            },250);
        });
    }

    // fonction d'effacement d'interval
    function fctclearIntervalMain(){
        //console.log('clear interval main');
        clearInterval(intervalMain)
    }
    function fctclearIntervalLoad(){
        //console.log('clear interval load (buttons)');
        clearInterval(intervalLoad)
    }
    function fctclearIntervalAdd(){
        //console.log("clear interval Add");
        clearInterval(intervalAdd)
    }


    // function liés aux overlay
    function hasClassOverlay(strClass){
        var arrMandatory=[
            'MuiPaper-root',
            'MuiPaper-elevation',
            'MuiPaper-elevation1'
            ];
        var hasAllClassOverlay = true;
        for(var i=0;i<arrMandatory.length;i++){
            hasAllClassOverlay = hasAllClassOverlay&&(strClass.includes(arrMandatory[i]));
        }
        return hasAllClassOverlay;

    }

    function addButtonEnlarge(divOverlay){
        var listButtonsDiv, button, enlargeButton;

        if(!document.getElementById('enlargeButton')){
            listButtonsDiv = divOverlay.querySelectorAll('button');
            //console.log(listButtonsDiv);
            if(listButtonsDiv.length>1){ // au moins un bouton, on recherche le premier bouton close
                for(var i=0;i<listButtonsDiv.length;i++){
                    button = listButtonsDiv[i];
                    if(button.getAttribute('aria-label') === 'Close'){
                        //console.log("founded");
                        enlargeButton = document.createElement("input");
                        enlargeButton.type='button';
                        enlargeButton.id='enlargeButton';
                        enlargeButton.value=defaultText;

                        button.after(enlargeButton);
                        document.getElementById('enlargeButton').addEventListener('click',overlayWidthCliqued);
                    }
                }
            }
        }
    }

    function overlayWidthCliqued(){
        //console.log("enlarge cliqued");
        var div = getOverlayDiv();
        if(div) {
            if(div.style.width==="100%"){
                document.getElementById('enlargeButton').value = 'agrandir';
                div.style.width = "50%";
            }else{
                div.style.width = "100%";
                document.getElementById('enlargeButton').value = 'réduire';
            }
        }

    }

    function getOverlayDiv(){
        var listDivs, div, goodDiv=false;;
        listDivs = document.querySelectorAll('div');
        //console.log(listDivs);
        for(var i=0;i<listDivs.length ; i++){
            div = listDivs[i];
            if(div.getAttribute('tabindex')){
                if(div.getAttribute('tabindex')=== "-1"){ // presence d'une div en overlay
                    //console.log(i+" : "+div.getAttribute('class'));
                    //console.log(div);
                    if(hasClassOverlay(div.getAttribute('class'))){
                        goodDiv=true;
                        break;
                    }
                }
            }
        }
        if(!goodDiv){div=undefined;}
        return div;
    }

    // fonciton d'ouverture de bandeau + modifier
    function addCliqued(){
        //console.log("add cliqued");
        var cpt=0;

        intervalAdd=setInterval(function intervalAdd(){
            var listDivs, div;
            div = getOverlayDiv();
            if(div){
                //console.log(div.style);
                addButtonEnlarge(div);
                div.style.width=defaultWidth;
                //overlayWidthCliqued();
                //console.log('clear interval divs');
                fctclearIntervalAdd();
            }
        },250);

    }
        /*
            <div class="MuiPaper-root MuiPaper-elevation MuiPaper-elevation1 jss75 MuiDrawer-paper MuiDrawer-paperAnchorRight css-1eudxhd"
            MuiButtonBase-root MuiIconButton-root MuiIconButton-colorPrimary MuiIconButton-sizeLarge jss598 css-1epcedm
            tabindex="-1"
            style="transform: none; transition: transform 225ms cubic-bezier(0, 0, 0.2, 1) 0ms;">
        */




})();