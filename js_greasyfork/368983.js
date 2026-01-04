// ==UserScript==
// @name         Smile Amazon
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Remind user to use smile.amazon
// @author       You
// @match        https://www.amazon.de*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/368983/Smile%20Amazon.user.js
// @updateURL https://update.greasyfork.org/scripts/368983/Smile%20Amazon.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let container;
    const redirectUrl = window.location.href.replace("https://www.amazon", "https://smile.amazon");
    const declineOffer = () => {
        //save a cookie for an hour or so
        //....TODO
        container.innerHTML = "";
    }

    const acceptOffer = () => {
        window.location.replace(redirectUrl);
    }

    const showPopup = () => {
        let stylesheet = `
            <style>
              #tmp_mk_smile{
        display: flex;
        background-color: rgba(0,0,0,0.3);
        justify-content: center;
        align-items: center;
        position: fixed;
        left: 0;
        top: 0;
        bottom: 0;
        right: 0;
z-index: 1000;
    }
    #tmp_mk_smile > div {
        width: 50%;
overflow: hidden;
        min-height: 30vh;
        box-shadow: 0 3px 20px rgba(0,0,0,0.4);
    background-color: #fafafa;
    text-align: center;
    border-radius: 10px;
    }
#tmp_mk_smile h1 {
border-bottom: 2px solid #b9b9b9;
    padding: 10px;
    background: linear-gradient(to bottom,#f0c14b,#f7dfa5);
    font-weight: 100;
}
#tmp_mk_smile h2{
padding: 30px;
    margin: 10px 0;
    font-weight: 100;
}
#tmp_mk_smile section{
padding: 10px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-evenly;
}
#tmp_mk_smile button{
 width: 48%;
    padding: 10px;
    border-radius: 4px;
    font-size: 1.1rem;
    background: linear-gradient(to bottom,#f7dfa5,#f0c14b);
}

#tmp_mk_smile button:nth-child(2){
background: linear-gradient(to bottom,#f7a5a5,#f04b4b)
}
            </style>
        `
        let markup = `
          <div><h1 style="">Hallo V!</h1>
          <h2>Willst du versuchen, die Seite über "smile.amazon" aufzurufen?</h2>
          <section>
            <button>Ja, bitte :)</button>
            <button>Nope</button></div>
          </section>
        `;
        container = document.createElement('div');
        container.id="tmp_mk_smile";
        container.innerHTML = stylesheet + markup;

        let btns = container.querySelectorAll('button');
        btns[0].addEventListener('click', acceptOffer);
        btns[1].addEventListener('click', declineOffer);

        window.document.body.append(container);
    }
    //wait a few seconds, so amazon does its stuff
    window.setTimeout(showPopup, 2000);


})();