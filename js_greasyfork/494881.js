// ==UserScript==
// @name        pictbland.net 小说下载
// @namespace   https://1mether.me/
// @match       http*://pictbland.net/items/detail/*
// @grant       none
// @version     0.3
// @author      乙醚(@locoda)
// @description b岛小说下载
// @license     MIT

// @downloadURL https://update.greasyfork.org/scripts/494881/pictblandnet%20%E5%B0%8F%E8%AF%B4%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/494881/pictblandnet%20%E5%B0%8F%E8%AF%B4%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==
(function() {
    "use strict";
    document.addEventListener('keydown', function(event) {
        switch (event.code) {
            case 'KeyD':
                // alert(event.code);
                downloadCurrentPageAsText();
                break;
        }
    });

    var title = document.querySelector('div#vmessage div.lead') || document.querySelector('div#vmessage div.title')
    var fileName = title.textContent + '.txt';

    var buttonsDiv = getButtonDiv();
    title.append(buttonsDiv);
    injectOneButton(buttonsDiv, '下载', downloadCurrentPageAsText);

    function downloadCurrentPageAsText() {
        var text = Array.from(document.querySelectorAll('div#novelall div.novelbody.protect')).map(node => node.innerText).join('\n')
        // var text = document.querySelectorAll('div#novelall div.novelbody.protect p') .innerText
        var myFile = new Blob([text], {
            type: 'text/plain'
        });
        var title = document.querySelector('div#vmessage div.lead') || document.querySelector('div#vmessage div.title')

        var link = document.createElement('a');
        link.download = fileName
        link.href = window.URL.createObjectURL(myFile)
        link.click()
    }

    function injectOneButton(element, textOnButton, clickListener) {
        var btn = document.createElement("BUTTON");
        var btnText = document.createTextNode(textOnButton);
        btn.appendChild(btnText);
        btn.addEventListener("click", clickListener);
        btn.style =
            "background-color: transparent; border: solid #808080 2px; border-radius: 20px; color: #545454; margin: 0.2em;";
        element.appendChild(btn);
    }

    function getButtonDiv() {
        var buttonsDiv = document.createElement("div");
        buttonsDiv.className = "bland-dl";
        buttonsDiv.style = "margin-top: 0.4em; margin-bottom: 0.4em";
        return buttonsDiv;
    }
})();