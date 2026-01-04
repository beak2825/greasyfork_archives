 // ==UserScript==
 // @name         Operator zwrotu | IAI
 // @namespace    http://butosklep.pl/panel/
 // @version      1.7
 // @description  Automatyczne przypisanie operatora zwrotu do loginu
 // @author       Marcin
 // @match        https://butosklep.pl/panel/returns.php?action=edit*
 // @match        https://butosklep.pl/panel/returns.php?action=add*
 // @match        https://butosklep.iai-shop.com/panel/returns.php?action=add*
 // @match        https://butosklep.iai-shop.com/panel/returns.php?action=edit*
 // @match        https://butosklep.pl/panel/rma.php?action=edit*
 // @match        https://butosklep.pl/panel/rma.php?action=add*
 // @match        https://butosklep.iai-shop.com/panel/rma.php?action=add*
 // @match        https://butosklep.iai-shop.com/panel/rma.php?action=edit*
 // @icon         https://butosklep.pl/gfx/pol/favicon.ico
 // @grant        none
// @downloadURL https://update.greasyfork.org/scripts/466991/Operator%20zwrotu%20%7C%20IAI.user.js
// @updateURL https://update.greasyfork.org/scripts/466991/Operator%20zwrotu%20%7C%20IAI.meta.js
 // ==/UserScript==

function getContentBetweenParentheses(str) {
    const regex = /\((.*?)\)/;
    const match = regex.exec(str);
    if (match && match.length > 1) {
        return match[1];
    }
    return '';
}

function searchOption(selectElement, searchText) {
    for (let i = 0; i < selectElement.options.length; i++) {
        let option = selectElement.options[i];
        if (option.text === searchText) {
            option.selected = true;
            return option;
        }
    }
    return null;
}

function getOperator() {
    const location = document.location.href;
    let operator;
    if (location.includes('rma')) {
        operator = IAI.rma.data.operator;
    } else {
        operator = IAI._returns.data.operator_name;
    }
    return operator;
}

function getWebType() {
    const location = document.location.href;
    let webType;
    if (location.includes('rma')) {
        webType = 'reklamacji';
    } else {
        webType = 'zwrotu';
    }
    return webType;
}

function checkOperator() {
    const operator = getOperator();
    const webType = getWebType();

    if (operator == '') {
        console.log('Operator niewybrany');
        let infoElement = document.querySelector('.table-parent-wrapper');
        let htmlcode = `<div class="msgWrapper " style="" id="msg_line_msg"><div style="background-color: red; padding: 15px;border: 1px solid transparent;"><div style="display: table;"><div><strong style="color: white;">OPERATOR NIEWYBRANY</strong></div></div></div></div>`;
        infoElement.insertAdjacentHTML("beforebegin", htmlcode);
    } else {
        console.log('Operator: ', operator);
        let infoElement = document.querySelector('.table-parent-wrapper');
        let htmlcode = `<div class="msgWrapper " style="" id="msg_line_msg"><div style="background-color: #F7BDB7; border-color: #bce8f1; color: #31708f; padding: 15px;border: 1px solid transparent;"><div style="display: table;"><div class="message"><strong>Operator ${webType}:</strong> <span id="msg_text_msg">${operator}</span></div></div></div></div>`;
        infoElement.insertAdjacentHTML("beforebegin", htmlcode);
    }

}

let selectElement = document.querySelector("[name='operator']");
let loggedUser = getContentBetweenParentheses(document.title);

let foundOption = searchOption(selectElement, loggedUser);
if (foundOption) {
    console.log('Option found:', foundOption.value);
} else {
    console.log('Option not found');
}
checkOperator();