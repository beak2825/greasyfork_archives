// ==UserScript==
// @name         JV Blacklist 2.0
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Script permettant de blacklister les topics de la liste des sujets en fonction de mots-clés
// @author       sNet
// @match        https://www.jeuxvideo.com/forums/0-51-*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/414558/JV%20Blacklist%2020.user.js
// @updateURL https://update.greasyfork.org/scripts/414558/JV%20Blacklist%2020.meta.js
// ==/UserScript==

//Initialisation du tableau dataBl
let regexL;
let regexR;
let dataBl;


// language = css
let css = `
/* ---- CODE CSS ---- */

/* Les couleurs variable (en cours d'implémentation) */

/* CSS pour régler la barre ou est placé le bouton ouvrant le modal */
.options-crumb {
    align-items:center;
    display:flex;
}

/* Stylé générique pour les boutons du modal */
.btnsModal{
    border:none;
    outline:none;
    color:#aaaaaa;
    filter:brightness(100%);
    padding:4px;
    margin:5px;
    background:#355164;
}

.btnsModal:hover{
    filter:brightness(70%);
}

/* Bouton ouvrant le modal */
#btnParam {
    font-family: 'Varela Round', sans-serif;
    letter-spacing: 0.1em;
    color: #e8e8e8;
    border: none;
    border-radius: 10px;
    outline: none;
    background: #3c3c3c;
    background-size: 400% 400%;
    cursor: pointer;
    filter:brightness(100%);
}

#btnParam:hover {
    filter:brightness(70%);
}

/* Modal */
.modal-closed {
    display:none;
}

.modal-open {
    font-family:"Roboto", sans-serif;
    font-weight:bold;
    display:grid;
    grid-template-rows: 15% 85%;
    grid-row-gap: 15px;
    width:20%;
    z-index:10000000000000000000000;
    position:fixed;
    top: 0;
    bottom:0;
    right: 0;
    background:#333;
    border:solid #aaaaaa 1px;
    color:#aaaaaa;
}

/* HEADER */
#modalHeader {
    align-items:center;
    display:grid;
    grid-template-columns: auto auto;
    justify-items: center;
}

#title {
    color:#aaa;
    letter-spacing: 0.1em;
    font-family: 'Varela Round', sans-serif;
    white-space: nowrap;
    font-size:150%;
    font-weight:normal;
}

#modalCloseBtn {
    background:none;
    border:none;
    outline:none;
    color:#aaaaaa;
    font-size: 150%;
}

#modalCloseBtn:hover {
    color:#b00000;
}

/* MODAL Main body */

.modal-body-open {
    display:grid;
    grid-template-rows: 85% 15%  ;
    grid-row-gap: 10px;
    align-content: space-between;
    justify-items:center;
}

#modalMainBody{
    display:grid;
    grid-template-rows: 10% auto  ;
    width:100%;
    align-itemps:center;
    justify-items:center;
}

.modal-body-closed{
    display:none;
}



/* Main Footer */

#modalMainFooter{
    display:grid;
    align-content: space-between;
    align-items:center;
}

#saveBtn {
    background:#015151;
}

#saveBtn:hover {
    filter:brightness(70%);
}

#saveReloadBtn {
    background:#333363;
}

#saveReloadBtn:hover {
    filter:brightness(70%);
}

#optionBtn {
    background:#410c47;
}

#optionBtn:hover {
    filter:brightness(70%);
}

#savedText {
    background-color:rgba(0,0,0,0);
    font-weight:bold;
    font-size:30px;
    opacity:0;
    align-self:center;
    color:#66FF85;
    border: 1px solid #66FF85;
    padding:4px;
}

/* TAG */

#blInput {
    width: 90%;
    border: #000 1px solid !important;
    text-align:center;
}

#blInput:focus {
    outline:none;
    border: #6d6d6d 1px solid  !important;
}

#blValue {
    width:90%;
    background-color:#4a4a4a;
    overflow:auto;
}

.blTag {
    background-color:#1a1a1a;
    padding:0.20em;
    margin:5px;
    display:inline-block;
}

.rmTag {
    background:none;
    border:none;
    outline:none;
    color:#aaaaaa;
    font-size: 100%;
    margin-left:0;
    margin-right:10px;
}

.rmTag:hover {color:#b00000;}

/* FADE IN FADE OUT */

.error{
    animation-name: error;
    animation-duration: 2s;
}

@keyframes error {
    0% {background-color: #1a1a1a;}
    50% {background-color: #b00000;}
    100% {background-color: #1a1a1a;}
}

.success{
    animation-name: success;
    animation-duration: 2s;
}

@keyframes success {
    0% {background-color: #1a1a1a;}
    50% {background-color: rgba(121, 255, 167, 0.4);}
    100% {background-color: #1a1a1a;}
}
`;
// language=HTML
let html = `
    <div id="blModal" class="modal-closed">
        <div id="modalHeader">
            <span id="title">JVC Topic Blacklist 2.0</span>
            <button id="modalCloseBtn" class="btnsModal">╳</button>
        </div>
        <div id="modalMain" class="modal-body-open">
            <div id="modalMainBody">
                <input id="blInput" placeholder="Saisir un mot à blacklister (insensible a la case)"/>
                <div id="blValue"></div>
            </div>
            <div id="modalMainFooter" class="modal-footer-open">
                <div id="modalBtns">
                    <button id="saveBtn" class="btnsModal">Sauvegarder</button>
                    <button id="saveReloadBtn" class="btnsModal">Sauvegarder et Rafraîchir</button>
                </div>
                <span id="savedText">Contenu Sauvegardé</span>
            </div>
        </div>
    </div>`;

// Fonction pour transformer un string en html

function parseHTML(html) {
    let t = document.createElement('template');
    t.innerHTML = html;
    return t.content.cloneNode(true);
}



// Toutes les fonctions initialisant le modal

function injectCss(css)
{
    let style = document.createElement('style');
    style.innerHTML = css;
    document.head.append(style);
}

function injectHtml(html) {

    //Injection de la police d'écriture
    let fontHtml = `<link href='https://fonts.googleapis.com/css?family=Roboto:100)' rel='stylesheet' type='text/css'>`;
    let fontHtmlCode = parseHTML(fontHtml);
    document.body.append(fontHtmlCode);

    //Injection du code HTML
    let htmlCode = parseHTML(html);
    document.body.append(htmlCode);
}

// Le bouton permettant d'ouvrir le modal

function injectBtn() {
    let btn = document.createElement("button");
    btn.id = "btnParam";
    btn.innerText = "Topic Blacklist";
    document.querySelector('.options-crumb').prepend(btn);
}


// Script du Modal

// Fonction permettant de gérer tout les clics sur les boutons

function setTrig() {

    document.querySelector('#btnParam').onclick = function () {
        openModal()
    };

    document.querySelector('#modalCloseBtn').onclick = function () {
        closeModal()
    };

    document.querySelector('#saveBtn').onclick = function () {
        saveBl(dataBl)
    };

    document.querySelector('#saveReloadBtn').onclick = function () {
        saveBl(dataBl);
        location.reload()
    };

    document.querySelector('#blValue').addEventListener('click', function (e) {
        if (e.target.className === "rmTag") {
            e.target.parentElement.remove();
        }
    });
}

// Format Le string (Met le string en minuscule, Enleve les espaces inutiles, enleve les caracteres unicode)

function formatS(str) {
    return str.replace(/ {2}/g, '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
}

// Gestion des INPUT (pour ajouter des mots a blacklister)


function setInput() {
    let inputElement = document.querySelector('#blInput');
    inputElement.onkeypress = function (e) {
        if (e.key === "Enter" && this.value) {
            let formatedValue = formatS(this.value);
            console.log("formated : " + formatedValue);
            if (this.value === formatedValue || formatedValue.length > 1) {
                let cantAdd = false;
                let tags = document.querySelectorAll('.blTag');
                for (let i = 0; i < tags.length; i++) {
                    let regex = new RegExp(regexL + tags[i].children[1].innerText + regexR, "gi");
                    if (formatedValue.match(regex)) {
                        let alreadyElement = tags[i];
                        cantAdd = true;
                        alreadyElement.className = "blTag error"
                        alreadyElement.scrollIntoView({behavior: 'smooth'});

                        console.log("can't add");
                    }
                }
                if (cantAdd === false) {
                    let blTag = appendTag(formatedValue);
                    blTag.className = "blTag success";
                    blTag.scrollIntoView({behavior: 'smooth'});
                }
            }
            this.value = "";
        }
    }
}

// Fonction permettant d'ajouter un tag

function appendTag(data) {
    let blValue = document.querySelector('#blValue');
    let blTag = document.createElement("div");
    blTag.className = "blTag";
    let blTagTxt = document.createElement("span");
    blTagTxt.innerText = data;
    let blTagBtn = document.createElement("button");
    blTagBtn.className = "rmTag";
    blTagBtn.innerText = "╳";
    blTag.append(blTagBtn);
    blTag.append(blTagTxt);
    blValue.append(blTag);
    return blTag
}

// Fonction initialisant les mots blacklisté au chargement de la page

function initValue() {
    let tag;
    if (dataBl.length > 0) {
        for (let i = 0; i < dataBl.length; i++) {
            tag = appendTag(dataBl[i]);
        }
    }
}

// Ouverture du modal

function openModal() {
    document.querySelector('#blModal').className = "modal-open";
    document.querySelector('#modalMain').className = 'modal-body-open';
}


// Fermeture du modal

function closeModal() {
    document.querySelector('#blModal').className = 'modal-closed';
    document.querySelector('#modalMain').className = 'modal-body-closed';
}


// Ouverture du menu option

function openOption() {
    document.querySelector('#modalMain').className = 'modal-body-closed';
}

// Fermeture du menu option

function closeOption() {
    document.querySelector('#modalMain').className = 'modal-body-open';
}

// Recupération des valeurs dans le localStorage au chargement de la page

function initData() {
    let storedData = localStorage.getItem("dataBlJSON");
    if (storedData) {
        dataBl = JSON.parse(storedData);
        dataBl.sort();
    } else {
        console.log("error : no stored data");
        dataBl = {};
    }
    return dataBl;
}

// Sauvegarde des nouveaux mots ajoutés

function saveBl() {
    dataBl = [];
    for (let i = 0; i < document.querySelectorAll('.blTag').length; i++) {
        dataBl[i] = document.querySelectorAll('.blTag span')[i].innerText;
    }
    localStorage.setItem("dataBlJSON", JSON.stringify(dataBl));
    //fadeOutEffect();
}

//Fonction ajoutant les mots importé au format texte a la blacklist

function importData() {
    console.log("import");
}

//Fonction exportant tout les mots blacklisté dans un format texte

function exportData() {
    console.log("export");
}

// La fonction de blacklist

function blacklister() {
    if (dataBl.length > 1) {
        let listeTopic = document.querySelectorAll('.topic-list-admin li');
        let nbDeleted = 0;
        for (let i = 1; i < listeTopic.length; i++) {
            let topicEstSupprime = false;
            let titreTopic = formatS(listeTopic[i].children[0].children[1].title);
            for (let j = 0; j < dataBl.length; j++) {
                let regex = new RegExp(regexL + dataBl[j] + regexR, "gi");
                if (titreTopic.match(regex) && topicEstSupprime === false) {
                    listeTopic[i].remove();
                    console.log("Supprimé : " + titreTopic);
                    topicEstSupprime = true;
                    nbDeleted++;
                } else {
                }
            }
        }
        if (nbDeleted > 0) {
            console.log("Nombre supprimé : " + nbDeleted);
        }
    } else {
        console.log("error : array is empty");
    }
}

// Fonction main

function main() {
    injectHtml(html);
    injectCss(css);
    regexL = "(^|\\s|\\(|\\\"|\\[|\\;|\\,|\\:|\\/|\'|\-|\"|’|\\*)(";
    regexR = ")($|\\s|\\.|\\,|\\]|\\)|\\;|\\:|\\!|\\/|\\?|\'|\-|\"|’|\\*)";
    dataBl = initData();
    injectBtn();
    initValue();
    setInput();
    setTrig();
    blacklister();
}

// Execution du main quand la page est chargé ...

main();

