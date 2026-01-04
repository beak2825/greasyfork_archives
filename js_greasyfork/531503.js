// ==UserScript==
// @name         Add Button
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Button Extend!
// @author       Апатия
// @license      MIT
// @match        https://zelenka.guru/forums/*
// @match        https://lolz.live/forums/*
// @match        https://lolz.guru/forums/*
// @match        https://zelenka.guru/threads/*
// @match        https://lolz.live/threads/*
// @match        https://lolz.guru/threads/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelenka.guru
// @supportURL   https://zelenka.guru/
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/531503/Add%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/531503/Add%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

function addButton() {
    var dropdown = document.querySelector('.fr-dropdown-list');
    var tippyPopper = document.querySelector('.tippy-popper');

    if (dropdown && tippyPopper) {
        if (!dropdown.querySelector('[data-cmd="newButton"]')) {
            var newLi = document.createElement('li');
            var newButton = document.createElement('a');
            newButton.classList.add('fr-command');
            newButton.setAttribute('data-cmd', 'newButton');
            newButton.style.whiteSpace = 'pre';

            var icon = document.createElement('i');
            icon.classList.add('fal', 'fa-circle', 'fa-fw');
            icon.setAttribute('aria-hidden', 'true');

            newButton.appendChild(icon);
            newButton.appendChild(document.createTextNode('  Кнопка'));

            newLi.appendChild(newButton);

            dropdown.appendChild(newLi);

            newButton.addEventListener('click', function() {
               alertExec()
            });
        }
    }
}



function alertExec() {
    removeXenForoAlert()
    document.querySelector('#lztInsert-1').click();
    var formHtml = `
                            <form id="xenforoFormButton" autocomplete="off" onsubmit="event.preventDefault();">
                                <label for="linkInput">Ссылка:</label>
                                <input type="text" id="linkInput" class="textCtrl" placeholder="Введите ссылку" /><br/>
                                <label for="textInput">Текст:</label>
                                <input type="text" id="textInput" class="textCtrl" placeholder="Введите текст" /><br/>
                                <button type="submit" class="button primary Overas">Вставить</button>
                            </form>
                        `;
                XenForo.alert(`${formHtml}`, 'Вставить кнопку');
                        document.querySelector('.button.primary.Overas').addEventListener('click', function() {
                        var link = document.querySelector('#linkInput').value;
                        var text = document.querySelector('#textInput').value;
                        addButtonToParagraph(link, text);
                        Array.from(document.querySelectorAll('.close.OverlayCloser')).pop().click();
});
}


function addButtonToParagraph(link, text) {
  const paragraph = Array.from(document.querySelectorAll(".fr-element.fr-view.fr-element-scroll-visible p")).pop();
  if (paragraph) {
    if (!link.startsWith('https://')) {
        link = 'https://' + link;
    }

    paragraph.innerHTML += `[button="${link}"]${text}[/button]`;
  }
}

function removeXenForoAlert() {
    var alertBox = document.querySelector('#xenforoFormButton');
    if (alertBox) {
        alertBox.remove();
    }
}



var observer = new MutationObserver(function(mutationsList, observer) {
    var openButton = document.querySelector('#lztInsert-1');

    if (openButton) {
        openButton.addEventListener('click', function() {
            setTimeout(addButton, 100);
        });

        observer.disconnect();
    }
});

observer.observe(document.body, { childList: true, subtree: true });

})();