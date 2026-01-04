// ==UserScript==
// @name         testy-prawnicze.pl pobieracz pytań
// @namespace    https://greasyfork.org/pl/users/389583-adrian080
// @version      0.3
// @description  Zestawia pytania i poprawne odpowiedzi w jednym miejscu.
// @author       Adrian080
// @match        https://*.testy-prawnicze.pl/*
// @icon         none
// @grant        window.onurlchange
// @license GNU  GPLv3
// @downloadURL https://update.greasyfork.org/scripts/494861/testy-prawniczepl%20pobieracz%20pyta%C5%84.user.js
// @updateURL https://update.greasyfork.org/scripts/494861/testy-prawniczepl%20pobieracz%20pyta%C5%84.meta.js
// ==/UserScript==

(function() {
    'use strict';

main();
//Handle changing URLs
if (window.onurlchange === null) {
    window.addEventListener('urlchange', (info) => {
        setTimeout(() => {//Just for weird blocking behavior...
            main();
        }, 2000);
    });
}

function main(){
    //Overwrite restrictions for copy and context menu
    document.body.setAttribute('oncopy', '');
    document.body.setAttribute('oncontextmenu', '');
    document.body.setAttribute('ondragstart', '');

    document.oncontextmenu = function () {};
    document.oncopy = function () {};
    document.ondragstart = function () {};

    const URL = window.location.href;

  if (URL.includes('card-')) { //Only when we are on single card view
    //Add styles
    const style = document.createElement('style');
    style.innerHTML = `
    #script-button {
        background-color:#1177d1;
        color:white;
        display:inline-block;
        border-radius:.5rem;
        font-size:1.2rem;
        padding:.4rem;
        margin:.2rem;
        cursor:pointer;
        transition:all 250ms
    }
    #script-button:hover{
        transform:scale(1.1,1.1);
        background-color:#135c9c
    }
    @keyframes popup-box{
        from{opacity:0;top:-20rem}to{opacity:1;top:0}
    }
    @keyframes popup-box-bg{
        from{background:rgba(0,0,0,0)}to{background:rgba(0,0,0,.5)}
    }
    #script-popup{
        animation-name:popup-box-bg;
        animation-duration:.8s;
        color:#fff;
        display:none;
        align-items:center;
        justify-content:center;
        background:rgba(0,0,0,.5);
        width:100%;
        height:100%;
        position:fixed;
        text-align:center;
        top:0;left:0;
        z-index:69691
    }
    #script-popup>div{
        line-height:160% !important;
        animation-name:popup-box;
        animation-duration:.8s;
        background-color:#323232;
        box-shadow:0 0 1.5rem .3rem #969696;
        height:auto;max-width:50%;
        vertical-align:middle;
        position:relative;
        border-radius:1rem;
        padding:1.5rem
    }
    #script-popup #popup-title{
        color:#0090ff;
        font-size:1.3rem;
        font-weight:bolder
    }
    #script-popup #script-page-count{
        font-size:1.1rem;
        color:#00a0ff
    }
    #script-popup .buttons-container{
        width:60%;
        margin:0 auto
    }
    #script-popup button{
        display:block;
        width:100%;
        margin:.4rem;
        padding:.4rem;
        color:#fff;
        font-weight:bolder;
        background-color:#0069ff;
        border:0;
        border-radius:.4rem;
        transition:all 250ms
    }
    #script-popup button:hover{
        background-color:#05f;
        transform:scale(1.1,1.1)
    }
    #popup-close-button{
        line-height:normal !important;
        background-color:#1e1e1e;
        border-radius:100%;
        display:inline-block;
        font-family:arial;
        font-weight:bolder;
        position:absolute;
        top:-1rem;right:-1rem;
        font-size:2rem;
        padding:0 .6rem;
        cursor:pointer
    }
    #popup-close-button:hover{
        background-color:#000e36
    }
    #script-popup input{
        border-radius:.3rem;
        padding:.1rem;
        width:16ch
    }
    pre{
        color: black;
        font-family: system-ui;
    }`;
    document.getElementsByTagName('head')[0].appendChild(style);

    //Create script button
    const scriptButton = document.createElement("span");
    scriptButton.setAttribute("id", "script-button");
    scriptButton.innerHTML = "Dawaj pytańska!";
    document.querySelectorAll('div.action-btns')[0].prepend(scriptButton);

    //Get the ammount of questions and the current question number
    const currentQuestionNumber = parseInt(document.querySelector('div.card-position span').innerText);
    const numberOfQuestions = parseInt(document.querySelector('span.js-cardset-card-quantity').innerText);

    //Create pop-up
    const popUp = document.createElement("div");
    popUp.setAttribute("id", "script-popup");
    popUp.innerHTML = `
    <div>
        <div id=popup-close-button>×</div>
        <div id=popup-title>Zbiera pytania z poprawnymi odpowiedziami</div>
        <br>
        Zakres pytań:
        <br>Początek (aktualnie otwarte pytanie): `+currentQuestionNumber+`
        <br><label for="last-cardn-number">Koniec: </label><input type="number" step="1" min="`+currentQuestionNumber+`" max="`+numberOfQuestions+`" value="`+numberOfQuestions+`" id="last-card-number">
        <br><br>
        <div class=buttons-container>
            <button id=script-activate>Zbierz je wszystkie 😏</button>
        </div>
    </div>`;
    document.getElementsByTagName("body")[0].prepend(popUp);

    const popupBox = document.getElementById("script-popup");
    const popupContent = document.querySelector("#script-popup div");
    const popupClose = document.getElementById("popup-close-button");
    const actionButton = document.getElementById("script-activate");

    scriptButton.addEventListener("click", () => {
        popupBox.style.display = "flex";
    });
    popupBox.addEventListener("click", () => {
        if (!popupContent.matches(":hover") || popupClose.matches(":hover")) {
            popupBox.style.display = "none";
        }
    });

    //Get current card id from URL
    let cardId = window.location.href.split('-')[2];
    let lastQuestionNumber;

    actionButton.addEventListener("click", () => {
        lastQuestionNumber = parseInt(document.getElementById("last-card-number").value);
        if (lastQuestionNumber > numberOfQuestions) {
            alert('Za duża liczba!\nMoże być maksymalnie taka jak numer ostatniego pytania.\nAż tyle to tego nie ma :P');
        }else if (lastQuestionNumber < currentQuestionNumber) {
            alert('Liczba nie może być mniejsza niż 1!\nMoże jeszcze ujemne pytania wymyślisz?');
        }else{
        collect(currentQuestionNumber, cardId);
        popupContent.innerHTML = `Proszę czekać...
                              <br>Zbieranie pytań i odpowiedzi...
                              <br><br>
                              Wczytano pytań: <span id="question-counter"></span>`;
        }
    });

    const collect = (currentQuestion, cardId) => {
        if (currentQuestion <= lastQuestionNumber){
            fetch(`https://www.testy-prawnicze.pl/card-${cardId}`)
            .then((response) => response.text())
            .then((text) => {
                collect(currentQuestion+1, getData(text, currentQuestion));
            })
        }else{
            document.querySelector('div#cardset-content').prepend(result);
            popupBox.style.display = "none";
            alert('Gotowe!');
        }
    }

    //Create hidden element where we dump all the stuff
    const result = document.createElement("pre");
    result.setAttribute("id", "combined-result");

    const getData = (innerHTML, questionNumber) => {
        const html = document.createElement('html');
        html.innerHTML = innerHTML;
        const container = html.querySelector('div.kartensatz-karte');
        result.append(`Pytanie `+questionNumber+`:
    `+container.querySelector('div#questionPureText').innerText+`
        Odpowiedź: `+container.querySelector('div.choice-container.checked div.js-mchoiceText-unformatted *').innerText+`

`);
        popupContent.querySelector('span#question-counter').innerText = questionNumber;
        return container.querySelector('a.next-card-btn').getAttribute('data-id').split('-')[1];
    }
  }
}
})();