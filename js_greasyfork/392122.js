// ==UserScript==
// @name         Evennode
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Evennode delete projects multiple
// @author       KoctrX
// @match        https://admin.evennode.com/a/list
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392122/Evennode.user.js
// @updateURL https://update.greasyfork.org/scripts/392122/Evennode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function deleteProjects() {
        const array = Array.from(document.getElementsByClassName('delete-checkbox'))
        .map(el => { return { isChecked: el.checked, value: el.value, id: el.parentNode.parentNode.id } })
        .filter(r => r.isChecked);
        if (array && array.length) {
            let text = `Вы уверены что хотите удалить эти проекты [${array.length}]:\n\n`;

            array.forEach((a, i) => { text += `${i + 1}. ${a.value}\n`; });

            text += `\nБезвозвратно!`;
            if (confirm(text)) {
                array.forEach(item => {
                    fetch(`https://admin.evennode.com/a/d/${item.value}/settings/delete`);
                    document.getElementById(`${item.id}`).remove();
                });
                Array.from(document.getElementsByClassName('delete-checkbox')).forEach(el => el.remove());

                renderDeleteCheckBoxes();
            }
        }
    }

    function getArrayAppsList() {
        return [
            ...Array.from(document.getElementsByClassName('odd')),
            ...Array.from(document.getElementsByClassName('even'))
        ];
    }

    function renderDeleteCheckBoxes() {
        getArrayAppsList().forEach((el, i) => {
            const id = `del-${i + 1}`;
            el.id = id;
            const name = el.children[1].children[0].getAttribute('href').split('/')[3];
            el.innerHTML += `<td><input type="checkbox" data-id="${id}" class="delete-checkbox" value="${name}"/></td>`;
        });
    }

    function renderDeleteChecksButton() {
        document.getElementsByClassName('icon-label')[0].innerHTML += `<button style="
cursor: pointer;
margin-left: 50px;
margin-top: .25rem;
margin-bottom: .25rem;
color: #dc3545;
border-color: #dc3545;
display: inline-block;
font-weight: 400;
text-align: center;
vertical-align: middle;
-webkit-user-select: none;
-moz-user-select: none;
-ms-user-select: none;
user-select: none;
border: 1px solid transparent;
padding: .375rem .75rem;
font-size: 1rem;
line-height: 1.5;
border-radius: .25rem;
transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;" id="deleteProjectsByChecks">Deleted check</button>`;
    }

    function addEventToDeleteChecksButton() {
        document.getElementById('deleteProjectsByChecks').addEventListener('click', deleteProjects);
    }

    renderDeleteCheckBoxes();
    renderDeleteChecksButton();
    addEventToDeleteChecksButton();
})();