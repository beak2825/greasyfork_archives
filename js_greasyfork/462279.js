// ==UserScript==
// @name         Mousehunt simplified friend's tab
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Simplified friend's tab
// @author       kaninchen
// @match        https://www.mousehuntgame.com/*
// @require      https://cdn.jsdelivr.net/npm/mousehunt-utils@1.3.0/mousehunt-utils.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mousehuntgame.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/462279/Mousehunt%20simplified%20friend%27s%20tab.user.js
// @updateURL https://update.greasyfork.org/scripts/462279/Mousehunt%20simplified%20friend%27s%20tab.meta.js
// ==/UserScript==

(function() {

    const name = [];
    const supplies = [];
    const dailyGift = [];
    const dailyRaffle = [];

    for (let i = 0; i < 20; i++) {
        var n = document.getElementsByClassName("friendsPage-friendRow-titleBar-name")[i].innerHTML
        name.push(n)
        var a = document.getElementsByClassName("userInteractionButtonsView full_buttons")[i].children[0].children[0].children[0].classList.length
        supplies.push(a)
        var b = document.getElementsByClassName("userInteractionButtonsView full_buttons")[i].children[1].children[0].children[0].classList.length
        dailyGift.push(b)
        var c = document.getElementsByClassName("userInteractionButtonsView full_buttons")[i].children[2].children[0].children[0].classList.length
        dailyRaffle.push(c)
    }

    for(var i = 0; i < name.length; i += 1) {
        // insert name
        let user = document.createElement("div");
        user.className = "name";
        user.innerHTML = name[i];

        //insert gift button
        let gift = document.createElement("button");
        gift.className = "giftButton";
        gift.innerHTML ="G";
        gift.onclick = () => {
            document.getElementsByClassName("userInteractionButtonsView-button sendGift mousehuntTooltipParent  ")[i].onclick();
        }

        //insert raffle button
        let raffle = document.createElement("button");
        raffle.className = "raffleButton";
        raffle.innerHTML ="T";
        raffle.onclick = () => {
            document.getElementsByClassName("userInteractionButtonsView-button sendTicket mousehuntTooltipParent  ")[i].onclick();
        }



        document.getElementsByClassName("friendsPage-list-header")[0].appendChild(user);
        document.getElementsByClassName("friendsPage-list-header")[0].appendChild(gift);
        document.getElementsByClassName("friendsPage-list-header")[0].appendChild(raffle);
    }
    //     function showUsers(){
    //         if (document.getElementsByClassName("friendsPage-list-header")[0].children.length < 3){


    //             }
    //             //             let btn = document.createElement("BUTTON");
    //             //             let div = document.getElementsByClassName("friendsPage-list-header")[0];
    //             //             btn.innerHTML = "G";
    //             //             div.appendChild(btn);

    //             //             btn.onclick = () => {
    //             //                 document.getElementsByClassName("userInteractionButtonsView-button sendGift mousehuntTooltipParent  ")[0].onclick()
    //             //             };
    //         }
    //     }

    //     onPageChange({
    //         friends: {
    //             show: () => {   showButtons()
    //                         }
    //         },
    //     });

    //     showButtons();

})();