// ==UserScript==
// @name        Yasno Schedule Turn Off Electricity Improvements
// @namespace   Violentmonkey Scripts
// @match       https://kyiv.yasno.com.ua/schedule-turn-off-electricity
// @match       https://yasno.com.ua/schedule-turn-off-electricity
// @grant       none
// @version     1.7
// @author      smithumble
// @run-at      document-end
// @description 10/11/2022, 00:31:19
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/454548/Yasno%20Schedule%20Turn%20Off%20Electricity%20Improvements.user.js
// @updateURL https://update.greasyfork.org/scripts/454548/Yasno%20Schedule%20Turn%20Off%20Electricity%20Improvements.meta.js
// ==/UserScript==

(function () {
    "use strict";

//     function initSaveAddress() {
//         var ITEM_NAME_STREET = "schedule-street";
//         var ITEM_NAME_IDENTITY = "schedule-identity";

//         var rowElem = document.querySelector('.schedule-row');
//         if (!rowElem) return;

//         var groupElem = rowElem.querySelector('.schedule-group');
//         if (!groupElem) return;

//         var streetElem = rowElem.querySelector('div[name="street"]');
//         if (!streetElem) return;

//         var identityElem = rowElem.querySelector('div[name="identity_type"]');
//         if (!identityElem) return;

//         function saveClickHandler(event){
//             event.preventDefault();
//             var street = streetElem.textContent.trim();
//             var identity = identityElem.textContent.trim()
//             if (street && identity) {
//                 localStorage.setItem(ITEM_NAME_STREET, street);
//                 localStorage.setItem(ITEM_NAME_IDENTITY, identity);
//             }
//         }

//         var saveButton = document.createElement('button');
//         saveButton.classList.add('form__btn');
//         saveButton.classList.add('form__text');
//         saveButton.classList.add('schedule-group');
//         saveButton.style = `
//             height: 45px;
//             justify-content: center;
//             grid-column-start: 4;
//         `;
//         saveButton.innerText = "Зберегти"
//         saveButton.addEventListener("click", saveClickHandler);
//         groupElem.parentNode.insertBefore(saveButton, groupElem);

//         var street = localStorage.getItem(ITEM_NAME_STREET);
//         if (!street) return;

//         var identity = localStorage.getItem(ITEM_NAME_IDENTITY);
//         if (!identity) return;

//         var streetInput = streetElem.querySelector('input');
//         if (!streetInput) return;

//         var identityInput = identityElem.querySelector('input');
//         if (!identityInput) return;

//         function triggerDropdown(input, value) {
//             input.value = value;
//             input.dispatchEvent(new Event('input'));
//             input.dispatchEvent(new Event('focus'));
//         }

//         triggerDropdown(streetInput, street);

//         function processDropdownMutations(value) {
//             return function (mutations, observer) {
//                 mutations.forEach(function(mutation) {
//                     mutation.addedNodes.forEach(function(addedNode) {
//                         if(addedNode.id.includes('__listbox')) {
//                             addedNode.querySelectorAll('li').forEach(function(elem) {
//                                 if (elem.textContent.trim() === value) {
//                                     elem.click();
//                                     observer.disconnect();
//                                 }
//                             })
//                         }
//                     });
//                 });
//             };
//         }

//         function processInputMutations(value) {
//             return function(mutations, observer) {
//                 mutations.forEach(function(mutation) {
//                     if (mutation.type === "attributes" && mutation.attributeName === "disabled") {
//                         triggerDropdown(mutation.target, value);
//                         observer.disconnect();
//                     }
//                 });
//             };
//         }

//         new MutationObserver(
//             processDropdownMutations(street)
//         ).observe(streetElem, {
//             subtree: false,
//             childList: true
//         });

//         new MutationObserver(
//             processInputMutations(identity)
//         ).observe(identityInput, {
//             attributes: true,
//             attributeFilter: ['disabled'],
//         });

//         new MutationObserver(
//             processDropdownMutations(identity)
//         ).observe(identityElem, {
//             subtree: false,
//             childList: true
//         });
//     }


    function initHighlightTime() {
        function getDate() {
            return new Intl.DateTimeFormat([], {
                timeZone: 'Europe/Kyiv',
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
            }).format(new Date())
        }

        var prevDate = getDate();

        function highlightTime() {
            var currentHour = new Intl.DateTimeFormat([], {
                timeZone: 'Europe/Kyiv',
                hour: 'numeric',
            }).format(new Date()) + ":00";

            document.querySelectorAll('.schedule .head').forEach(function(elem) {
                if (prevDate != getDate()) {
                    location.reload();
                }
                if (elem.textContent.trim() === currentHour) {
                    elem.classList.add('active');
                    elem.classList.add('blackouts');
                } else {
                    elem.classList.remove('active');
                    elem.classList.remove('blackouts');
                }
            });
        }

        highlightTime();

        setInterval(highlightTime, 1000 * 60);
    }

    // initSaveAddress();
    initHighlightTime();

})();
