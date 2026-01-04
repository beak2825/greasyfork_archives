// ==UserScript==
// @name         Name related
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  For kingz
// @author       Aymay
// @match        https://gota.io/web/
// @icon         https://cpip.ro/wp-content/uploads/2019/02/script-logo.png
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/434297/Name%20related.user.js
// @updateURL https://update.greasyfork.org/scripts/434297/Name%20related.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle (`
        #chat-panel {
            overflow: visible; !important;
        }
        .container__item {
            position: absolute;
            transform: translate(0, -65px);
            width: 100%;
            pointer-events: auto;
            user-select: auto;
            -webkit-user-select: auto;
        }
        .form {
            width: 100%;
        }
        .uppercase {
            text-transform: uppercase;
        }
        .btn {
            display: inline-block;
            background: transparent;
            color: inherit;
            font: inherit;
            border: 0;
            outline: 0;
            padding: 0;
            transition: all 200ms ease-in;
            cursor: pointer;
        }
        .btn--primary {
            background: #3c3c3c;
            color: #fff;
            box-shadow: 0 0 10px 2px rgba(0, 0, 0, .1);
            border-radius: 2px;
            padding: 12px 36px;
        }
        .btn--primary:hover {
            background: #3c3c3c;
            transform: scale(1.05);
            opacity: 1;
        }
        .btn--primary:active {
            background: #3c3c3c;
            box-shadow: inset 0 0 10px 2px rgba(0, 0, 0, .2);
        }
        .btn--inside {
            position: absolute;
            right: 5px;
            margin-top: 10px;
            opacity: 0.4;
        }
        .form__field {
            width: 70%;
            background: transparent;
            color: #a3a3a3;
            font: inherit;
            font-size: 1rem;
            box-shadow: 0 6px 10px 0 rgba(0, 0, 0, .1);
            border: 0;
            outline: 0;
            padding: 22px 18px;
        }
         `);
    //not really related to the rest of the program
    //make chat text selectable
    document.getElementById("chat-container").style.WebkitUserSelect="Text";
    ////////////////////////////////////////////////////////////////////////

    const chat_container = document.querySelector('#chat-panel');
    const name_box = document.querySelector('#name-box');

    const form_string = `<div class="container__item"><div class="form"><input type="text"class="form__field" placeholder="Name" maxlength="20" /><button type="button" class="btn btn--primary btn--inside uppercase">Change</button></div></div>`;
    const form = document.createRange().createContextualFragment(form_string);

    chat_container.insertBefore(form, chat_container.children[0]);

    setTimeout(() =>{
        const form_dom = document.querySelector('.form__field');
        form_dom.value = name_box.value;
    }, 2000);

    name_box.addEventListener('change', (e) => {
        const form_dom = document.querySelector('.form__field');
        form_dom.value = name_box.value;
    });
    const button_dom = document.querySelector('.form > button');
    button_dom.addEventListener('click', (e) => {
        const form_dom = document.querySelector('.form__field');
        name_box.value = form_dom.value;
    });
    const form_dom = document.querySelector('.form__field');
    form_dom.addEventListener('keyup', (e) => {
        if(e.keyCode === 13) {
            button_dom.click();
            form_dom.blur();
        }
    });
})();