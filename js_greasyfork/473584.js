// ==UserScript==
// @name         User Notes
// @namespace    http://tampermonkey.net/
// @author       Nicky (https://zelenka.guru/members/2259792/)
// @version      1.2.2
// @description  Отображение заметки о пользователе
// @match        https://zelenka.guru/*
// @icon         https://zelenka.guru/data/avatars/l/2259/2259792.jpg?1690711557
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/473584/User%20Notes.user.js
// @updateURL https://update.greasyfork.org/scripts/473584/User%20Notes.meta.js
// ==/UserScript==

var show_in_memberCard = true; // Напишите true - если Вы хотите, чтобы в мини профиле показывались заметки или false - если нет

function registerInput(element, link) {
    element.val(GM_getValue(link));
    if (element[0].localName == "textarea") {
        element[0].style.height = element[0].scrollHeight + 'px';
        element[0].addEventListener('input', () => {
            element[0].style.height = 'auto';
            element[0].style.height = element[0].scrollHeight + 'px';
        });
    }
    element[0].addEventListener('input', function (event) {
        GM_setValue(link, event.target.value);
    });
}

function addNote(element = null){
    let createInput = () => {
        return $('<input type="text" id="link_input" placeholder="none" autocomplete="off" style="background: rgb(0, 0, 0, 0) !important; color: rgb(214, 214, 214);border: 0; width: -webkit-fill-available; padding: 3px 0 1px">');
    };
    let createSection = () => {
        return $(`
        <div class="section">
            <div class="secondaryContent">
                <h3>Заметка</h3>
                <textarea class="note" type="text" id="link_input" placeholder="none" autocomplete="off" style="color: rgb(214, 214, 214); border: 0px; width: -webkit-fill-available; resize: none; overflow: hidden; overflow-wrap: break-word; min-height: 53px; background: rgba(0, 0, 0, 0) !important;"></textarea>
            </div>
        </div>
        `);
    };
    let createContainer = () => {
        return $(`</div>
		<div class="title">
			Заметка
		</div>
        <div class="activityContainer">
            <textarea class="noteMemberCard" type="text" id="link_input" placeholder="none" autocomplete="off" style="color: rgb(214, 214, 214);border: 0px;width: -webkit-fill-available;resize: none;overflow: hidden;overflow-wrap: break-word;min-height: 17px;max-height: 71px;background: rgba(0, 0, 0, 0) !important;">
        </div>
        `)
    };

    let currentURL = window.location.href;

    if (currentURL == 'https://zelenka.guru/account/ignored' && !element) {
        let member = document.getElementsByClassName('member');
        for (let element of member) {
            let input = createInput();
            let userStatus = element.querySelector('.userBlurb');
            input[0].style.width = '71%';
            userStatus.after(input[0]);

            registerInput(input, element.querySelector('a[href]').href);
        }
        return
    }
    else if (element && show_in_memberCard) {
        let container = createContainer();
        let userContainers = $(element.querySelector('.activityContainer'));
        userContainers.after(container);

        registerInput(container.find('textarea'), element.querySelector('a[href]').href);
    }
    else {
        if ($('.note')[0] || !$('.section.insuranceDeposit')[0]) {
            return;
        }
        let textarea = createSection();
        let sidebar = $('.sidebar');
        sidebar[0].insertBefore(textarea[0], sidebar[0].childNodes[4]);

        registerInput(textarea.find('textarea'), window.location.href);
    }
}

window.onload = function() {
    const observer = new MutationObserver(function(mutationsList) {
        for (let mutation of mutationsList) {
            for (let addedNode of mutation.addedNodes) {
                if (addedNode instanceof HTMLElement && addedNode.classList.contains('modal') && addedNode.querySelector('.memberCard')) {
                    addNote(addedNode);
                }
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
};

addNote();