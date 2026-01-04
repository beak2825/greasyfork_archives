// ==UserScript==
// @name         Beautiful Evades
// @name:ru      Красивый Евадес
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description     Makes evades more beautiful and a little more logical!!
// @description:ru  Делает евадес красивее и немного логичнее!!
// @author       Ds: evades123
// @match        https://evades.io/
// @license      MIT
// @run-at          document-start
// @grant           GM_addStyle
// @icon         https://www.google.com/s2/favicons?sz=64&domain=evades.io
// @downloadURL https://update.greasyfork.org/scripts/508437/Beautiful%20Evades.user.js
// @updateURL https://update.greasyfork.org/scripts/508437/Beautiful%20Evades.meta.js
// ==/UserScript==

/*
Привет всем разработчикам Evades.io!
*/

const Version = `1.0.0`


    // Ваши CSS стили
    GM_addStyle(
        /* Замените этот CSS код на нужный вам */
    `.button {
    color: #eeeeee;
    border-radius: 10px;
    cursor: pointer;
    border: 1px solid #eeeeee;
    background-color: #0000;
    outline: 2px #808080 solid;
    text-shadow: #eeeeee 0 0 10px, #ffffff 0 0 20px, #ffffff79 0 0 25px;
    outline-offset: -3px;
    margin: 4px 2px;
    padding: 8px 12px;
    font-weight: 700;
    font-size: 14px;
    display: block;
}

.button:hover {
    border: 1px solid #050505;
    color: #050505;
    background-color: #eeeeee;
    transition: 500ms;
    text-shadow: #0000 0 0 10px, #0000 0 0 20px, #00000079 0 0 25px;
}`
);

