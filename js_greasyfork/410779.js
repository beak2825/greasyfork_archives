// ==UserScript==
// @name         Зачеркнутый текст Вконтакте
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Позволяет создавать зачеркнутый текст Вконтакте, путем выделения части сообщения и нажатия соответствующей клавиши
// @author       Silent_North
// @include      https://vk.com/*
// @grant        none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/410779/%D0%97%D0%B0%D1%87%D0%B5%D1%80%D0%BA%D0%BD%D1%83%D1%82%D1%8B%D0%B9%20%D1%82%D0%B5%D0%BA%D1%81%D1%82%20%D0%92%D0%BA%D0%BE%D0%BD%D1%82%D0%B0%D0%BA%D1%82%D0%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/410779/%D0%97%D0%B0%D1%87%D0%B5%D1%80%D0%BA%D0%BD%D1%83%D1%82%D1%8B%D0%B9%20%D1%82%D0%B5%D0%BA%D1%81%D1%82%20%D0%92%D0%BA%D0%BE%D0%BD%D1%82%D0%B0%D0%BA%D1%82%D0%B5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function chatFieldSelectionListener() {

    let selectCoords = {
        startSelection: 0,
        endSelection: 0
    };

    let chatField = document.querySelector(".im_editable.im-chat-input--text._im_text");

    document.onselectionchange = function () {

        selectCoords.startSelection = 0;
        selectCoords.endSelection = 0;

        let { anchorNode, anchorOffset, focusNode, focusOffset } = document.getSelection();

        if (anchorNode === chatField.firstChild) {
            
            selectCoords.startSelection = anchorOffset;
            selectCoords.endSelection = focusOffset;
            console.log(selectCoords.startSelection);
            console.log(selectCoords.endSelection);            
        }
    }

    return function () {

        if(selectCoords.startSelection == selectCoords.endSelection) {
            return;
        } else if(selectCoords.startSelection > selectCoords.endSelection) {
            [selectCoords.startSelection, selectCoords.endSelection] = [selectCoords.endSelection, selectCoords.startSelection];
        }

        let chatFullText = chatField.innerHTML;

        let strToRemove = /&amp;/ig;
        let strToRemove2 = /&nbsp;/ig

        chatFullText = chatFullText.replace(strToRemove, "&");
        chatFullText = chatFullText.replace(strToRemove2, " ");

        console.log(chatField.innerHTML);
        let textBeforeSelection = chatFullText.slice(0, selectCoords.startSelection);
        let textSelected = chatFullText.slice(selectCoords.startSelection, selectCoords.endSelection);
        let textAfterSelection = chatFullText.slice(selectCoords.endSelection, chatFullText.length);

        let newTextSelected = textSelected[0];

        for(let i = 1; i < textSelected.length; i++) {
            newTextSelected = newTextSelected + "&#0822;" + textSelected[i] + "&#0822;";
        }        
        
        chatFullText = textBeforeSelection + newTextSelected + textAfterSelection;
        chatField.innerHTML = "";
        chatField.insertAdjacentText("afterbegin", chatFullText);

    }
}

function start() {
    setTimeout(() => {

        document.querySelector(".im_editable.im-chat-input--text._im_text").style.paddingRight = "105px";
        buttonBuilder();

    }, 1000);
}

function btnCreator() {


    let myButt = document.createElement("button");

    myButt.innerHTML = "&#580";
    myButt.className = "silent_north-butt";
    myButt.title = "Зачеркнуть выделенный текст";
    myButt.onclick = chatFieldSelectionListener();

    return myButt;

}

function buttonBuilder() {

    let chatField = document.querySelector(".im_chat-input--buttons");
    chatField.prepend(btnCreator());

}



document.getElementById("l_msg").addEventListener("click", () => {
    start();
});

if (document.location.href.includes("/im")) {
    start();
}

let style = document.createElement("style");
style.innerHTML = `
        .silent_north-butt {
            font-size: 22px;
            background-color: transparent;
            color: #9C9D9F;
            border: none;
            cursor: pointer;
        }
        .silent_north-butt:hover {
            color: #bcbebe;
        }
    `

document.head.append(style);
    
})();