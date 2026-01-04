// ==UserScript==
// @name WorkHelper
// @namespace http://tampermonkey.net/
// @version 1.0.0
// @description Helper for work
// @license MIT
// @author DeHydra
// @match https://max.credit/manager/*
// @match https://svoi-ludi.ru/manager/*
// @icon https://www.google.com/s2/favicons?sz=64&domain=max.credit
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/526663/WorkHelper.user.js
// @updateURL https://update.greasyfork.org/scripts/526663/WorkHelper.meta.js
// ==/UserScript==

(function() {
'use strict';
((D, B, log = arg => console.log(arg)) => { 
 
const host = window.location.host;

const Colors = {
    green: "#7AB733",
    darkGreen: "#6DA42E",
    red: "#d7382c"
}

const RecurringConfig = {
    recurringAmount: "101",
    isCommentNeed: true
}

const Tools = {
    openPage: function (url) {
        window.open(url);
    }
}

const Templates = {
    button: function (btnText, btnColor, borderColor, btnAction){
        let button = D.createElement('a');

        button.appendChild(D.createTextNode(btnText));
        button.className += "btn btn-primary";
        button.style.backgroundColor = btnColor;
        button.style.borderColor = borderColor;
        button.style.marginRight = "5px";
        button.addEventListener("click", () => { btnAction() });

        return button;
    },
    
    option: function(optValue){
        let opt = D.createElement("option");

        opt.appendChild(D.createTextNode(optValue));
        opt.value = optValue;

        return opt;
    },

    cardOption: function(cardNumber, cardExpire, cardValue){
        let opt = D.createElement("option");

        opt.appendChild(D.createTextNode(cardNumber + " " + cardExpire));
        opt.value = cardValue;

        return opt;
    }    
}

const CollectorDebt = {
    getDebts: function () {
        let table = D.querySelector(".kv-grid-table");
        let rows = table.children[1].children;
        let debts = [];

        for (let row of rows) {
            debts.push(row.children[1].children[0].getAttribute("href").split("=")[1])
        }

        return debts;
    },

    openPage: function(pageName) {
        let debtList = this.getDebts();

        for (let debt of debtList) {
            Tools.openPage(`https://${host}/manager/${pageName}?id=${debt}`);
        }
    },

    addOptions: function () {
        let perPage = D.getElementsByName("per-page");
        let options = [20, 50, 100, 500, 1000];

        while (perPage[0].firstChild) {
            perPage[0].removeChild(perPage[0].lastChild);
        }
    
        for (let i = 0; i < options.length; i++) {
            perPage[0].appendChild(Templates.option(options[i]));
        }
    },

    addButtons: function () {
        let pullLeft = D.querySelector(".pull-left");

        pullLeft.appendChild(Templates.button("Открыть списания", Colors.green, Colors.darkGreen, () => {this.openPage("recurring/add") }));
        pullLeft.appendChild(Templates.button("Открыть договоры", Colors.green, Colors.darkGreen, () => {this.openPage("collector-comment/view")}));        

    },

    start: function () {
        this.addOptions();
        this.addButtons();
    }
}

const RecurringId = {
    start: function () {
        let table = D.querySelector(".kv-grid-table");
        let firstRow = table.children[1].children[0];
        let status = firstRow.children[1].firstChild.text;
        let cardsCount = firstRow.children[6].textContent;
        let cash = firstRow.children[7].textContent;
        let favicon = D.querySelector("link[rel~='icon']");

        if (status === "Ошибка" || status === "Успешно") {
            firstRow.style.color = "#fff";
        }
        if (status === "Успешно") {
            firstRow.style.backgroundColor = Colors.green;
            favicon.href = 'https://www.flaticon.com//favicon.ico';
        } else if (status === "Ошибка"){
            if (cardsCount === "1" && cash === "101,00"){
                window.close();
            }
            firstRow.style.backgroundColor = Colors.red;
        }
    }
}

const Recurring = {
    closeIfError: function () {
        let sysText = D.querySelector(".sys__text");        

        if (B.className === "body_404" || sysText !== null){
            window.close();
        }
    },

    deleteSameCards: function (cardsList) {
        let cards = [];
        let cardsFinal = [];
        let cardIndex;

        for (const child of cardsList) {
            cards.push({
                cardNumber: child.textContent.split(' ')[0],
                cardExpire: child.textContent.split(' ')[1],
                value: parseInt(child.value)
            });
        }
        
        for (const card of cards){
            let detectedCard = cardsFinal.find(c => c.cardNumber === card.cardNumber);
            log("Is Card Detected: " + detectedCard)  
            
            if (typeof detectedCard === "undefined") {
                log("add new card")
                cardsFinal.push(card)
            } else if (detectedCard.cardExpire < card.cardExpire || detectedCard.value < card.value) {
                cardIndex = cardsFinal.indexOf(detectedCard);
                cardsFinal.splice(cardIndex, 1, card);
            }
        }
        
        while(cardsList.firstChild){
            cardsList.removeChild(cardsList.lastChild);
        }

        for (const card of cardsFinal){
            cardsList.appendChild(Templates.cardOption(card.cardNumber, card.cardExpire, card.value));
        }
    },

    formAutoFill: function () {
        let recurringformAmount = D.querySelector("#recurringform-amount");
        let recurringformComment = D.querySelector("#recurringform-comment");
        let recurringformCardID = D.querySelector("#recurringform-cardid");
        let cardsCount = 0;
        
        this.deleteSameCards(recurringformCardID);
   
        cardsCount = recurringformCardID.childElementCount
        recurringformAmount.value = RecurringConfig.recurringAmount;

        if (cardsCount === 0) {
            window.close();
        }

        if (RecurringConfig.isCommentNeed) {
            recurringformComment.value = cardsCount
        }
    },

    start: function () {
        this.closeIfError();
        this.formAutoFill();
    }
}

const ChoosePage = {
    collectorDebt: function () {
        CollectorDebt.start();
        },

    recurringId: function () {
        RecurringId.start();
    },

    recurring: function () {
        Recurring.start();
    },

    collectorComment: function () {
        CollectorComment.start();
    },

    clientProfile: function () {
        ClientProfile.start();
    },

    start: function () {
        const url = window.location.href.split("/")[4];

        switch (true) {
            case /collector-debt/.test(url):
                ChoosePage.collectorDebt();
                break;
            
            case /recurring\?id=/.test(url):
                ChoosePage.recurringId();    
                break;

            case /recurring/.test(url):
                ChoosePage.recurring();
                break;

            default:
                log("Page not scripted");
                break;
        }
    }
}    

const APP = {
    init : function () {
        ChoosePage.start();
        log("Start")
    }
};

APP.init();

})(document, document.body)

})();