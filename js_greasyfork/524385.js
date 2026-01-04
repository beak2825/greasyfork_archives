// ==UserScript==
// @name         Extract linkedin user info from user search list
// @namespace    http://tampermonkey.net/
// @version      1.3
// @author       Mathieu Vedie
// @description  Script that extracts and copies linkedin account information in CSV format to the clipboard when searching for users.
// @match        https://www.linkedin.com/search/results/people/?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=linkedin.com
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/524385/Extract%20linkedin%20user%20info%20from%20user%20search%20list.user.js
// @updateURL https://update.greasyfork.org/scripts/524385/Extract%20linkedin%20user%20info%20from%20user%20search%20list.meta.js
// ==/UserScript==


(function () {
    'use strict';

    // CSS pour le bouton flottant
    GM_addStyle(`
    #copyUserInfoWrapper {
           position: fixed;
            top: 100px;
            left: 20px;
            z-index: 10000;
            display:flex;
            flext-direction:row;
    }
        #copyUserInfoWrapper input {
            display:inline-block;
            box-sizing:border-box;
            border-radius: 0 5px 5px 0;

            padding: 10px 15px;
            background-color: #FFF;
            font-size: 14px;
            font-weight: bold;
            border: none;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
            white-space:nowrap;
            height:100%;
        }

        #copyUserInfoButton {
            padding: 10px 15px;
            background-color: #0073b1;
            color: white;
            font-size: 14px;
            font-weight: bold;
            border: none;
            border-radius: 5px 0 0 5px;
            cursor: pointer;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
            display:inline-block;
            white-space:nowrap;
            box-sizing:border-box;
        }
        #copyUserInfoButton:hover {
            background-color: #005582;
        }


        #copyUserInfoButton_oneshot {
            position: fixed;
            top: 150px;
            left: 20px;
            padding: 10px 15px;
            background-color: #0073b1;
            color: white;
            font-size: 14px;
            font-weight: bold;
            border: none;
            border-radius: 5px 0 0 5px;
            cursor: pointer;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
            display:inline-block;
            white-space:nowrap;
            box-sizing:border-box;
        }
        #copyUserInfoButton_oneshot:hover {
            background-color: #005582;
        }

        .artdeco-pagination--has-controls > button:last-child {
            position: fixed;
            top: 200px;
            left: 20px;
            padding: 10px 15px;
            background-color: #0073b1;
            color: white;
            font-size: 14px;
            font-weight: bold;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            z-index: 10000;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
        }
    `);

    // Crée le bouton
    const wrapper = document.createElement('div');
    wrapper.id = 'copyUserInfoWrapper';
//    button.textContent = 'Copy Infos';


    const input = document.createElement('input');
    input.setAttribute('type','number');
    //input.id
    input.value = '1';

    const button_all = document.createElement('button');
    button_all.id = 'copyUserInfoButton';
    button_all.textContent = 'Copy info to page n°';
    wrapper.appendChild(button_all);
    wrapper.appendChild(input);


    const button_one = document.createElement('button');
    button_one.id = 'copyUserInfoButton_oneshot';
    button_one.textContent = 'Copy One Shot';
    wrapper.appendChild(button_one);

   document.body.appendChild(wrapper);

    function isAtEnd() {
        console.log('isAtEnd');
        if (!document.querySelector('.artdeco-pagination--has-controls .artdeco-pagination__button--next') || !document.querySelector('.artdeco-pagination--has-controls ul .artdeco-pagination__indicator.selected button span')) {
            console.log('isAtEnd Case 1');
            return true;
        }
        if (document.querySelector('.artdeco-pagination--has-controls .artdeco-pagination__button--next').classList.contains('artdeco-button--disabled')) {
            console.log('isAtEnd Case 2');
            return true;
        }
        if (parseInt(document.querySelector('.artdeco-pagination--has-controls ul .artdeco-pagination__indicator.selected button span').textContent.trim()) >= parseInt(input.value)) {
            console.log('isAtEnd Case 3');
            return true;
        }
        return false;
    }

    function scrollToBottom(callback_fn) {
        console.log('scrollToBottom');
        // Descendre en bas de la page après 1 seconde
        //setTimeout(() => {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
            if (typeof callback_fn === 'function') {
                callback_fn();
            }
        //}, 2000);
    }
    let datas = '';
    let entry_count = 0;
    function startCopy() {
        console.log('startCopy');
        datas = '';
        entry_count=0;
        scrollToBottom(() => {
           setTimeout(() => {
               treatCurrentPage();
           },2000);
        });
        button_all.textContent = 'Copying ...';
        input.setAttribute('readonly',true);
    }

    function treatCurrentPage() {
        console.log('treatCurrentPage');
        let csv = buildDataFromCurrentPage();
        if (null === csv) {
            console.log('csv is null');
            endCopy();
            return;
        }
        else {
            datas += csv;
            if (isAtEnd()) {
                endCopy();
                return;
            }
            goToNextPage();
        }
    }

    function endCopy() {
        console.log('endCopy');
        GM_setClipboard(datas);
        button_all.textContent = 'Copy info to page n°';
        input.removeAttribute('readonly');
        alert(`${entry_count} utilisateurs copiés !`);
    }

    function goToNextPage() {
        console.log('goToNextPage');
        if (!document.querySelector('.artdeco-pagination--has-controls > button:last-child')) {
            endCopy();
        }
        document.querySelector('.artdeco-pagination--has-controls > button:last-child').click();
        setTimeout(() => {
            scrollToBottom(() => {
                setTimeout(() => {
                    treatCurrentPage();
                },2000);
            },2000);
        },3000);
    }


    function buildDataFromCurrentPage() {
        console.log('buildDataFromCurrentPage');
        const userList = document.querySelector('ul[role="list"]');

        if (userList) {
            const listItems = userList.querySelectorAll('li');
            const results = [];

            listItems.forEach((item) => {
                const name = item.querySelector('a span[aria-hidden="true"]')?.innerText || 'Nom non trouvé';
                const jobTitle = item.querySelector('div.t-black.t-normal')?.innerText.trim() || 'Poste non trouvé';
                const location = item.querySelector('div.t-normal:not(.t-black)')?.innerText.trim() || 'Localisation non trouvée';
                const profileLink = (item.querySelector('a[data-test-app-aware-link]')?.href || 'Lien non trouvé').split('?')[0];
                results.push({ name, jobTitle, location, profileLink });
                entry_count++;
            });

            const csvContent = results.map(result =>
                `${result.name};${result.jobTitle};${result.location};${result.profileLink}`
            ).join('\n') + '\n';

            return csvContent;
        } else {
            return null;
        }
    }

        // Fonction pour extraire les infos et copier dans le presse-papiers
    button_all.addEventListener('click', () => {
        startCopy();
    });



    // Fonction pour extraire les infos et copier dans le presse-papiers
    button_one.addEventListener('click', () => {
        let csv = buildDataFromCurrentPage();
        if (csv === null) {
            alert('La liste d\'utilisateurs n\'a pas été trouvée.');
            return false;
        }
        GM_setClipboard(csv);
        button_one.textContent = 'Copied !';
        setTimeout(() => {
            button_one.textContent = 'Copy One Shot';
        },500);
    });

//    scrollToBottom();
})();