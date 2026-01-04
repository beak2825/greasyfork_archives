// ==UserScript==
// @name         Admin Product Buttons
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Only product buttons like Copy, Edit, BagList, etc.
// @author       Nikitin
// @match        *://tngadmin.triplenext.net/*
// @match        *://yruleradmin.triplenext.net/*
// @match        *://yrulermgr.triplenext.net/*
// @match        *://tngadmin-dev.triplenext.net/*
// @match        *://tngtest.westus.cloudapp.azure.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=triplenext.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531554/Admin%20Product%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/531554/Admin%20Product%20Buttons.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
    .custom-btn {
        padding: 6px 16px;
        margin: 5px;
        border: none;
        border-radius: 6px;
        background-color: #493E3E;
        color: #BFE7ED;
        font-size: 11px;
        font-family: 'Roboto Condensed', sans-serif;
        text-transform: uppercase;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        justify-content: flex-start;
        transition: background-color 0.3s;
    }
    .custom-btn:hover {
        background-color: #4C585A;
    }
    .custom-btn:active {
        background-color: #2CA9BC;
    }
    .pos-left .image-btn {
        margin-right: 12px;
        order: -1;
    }
    .pos-right .image-btn {
        margin-left: 12px;
        order: 1;
    }
    .pos-left .arrow-svg {
        transform: rotate(180deg);
    }
    .baglist-svg {
        margin-bottom: 4px;
    }
    #page {
        position: relative;
    }
    .button-container {
        position: absolute;
        top: 0px px;
        left: -124px;
        width: 120px;
        height: 270px;
        display: flex;
        flex-direction: column;
        align-items: stretch;
    }
    #page .custom-btn {
        margin: 2px 0px;
    }
    #page #copyCdnFromProducts {
        margin-bottom: 20px;
    }
    `;
    document.head.appendChild(style);

    // SVG иконка
    const svgEdit = '<svg class="image-btn edit-svg" width="14" height="14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.745 1.255a2.185 2.185 0 0 0-3.09 0L4.679 6.23a2.1 2.1 0 0 0-.552.975L3.52 9.63a.7.7 0 0 0 .849.848l2.423-.605a2.1 2.1 0 0 0 .976-.553l4.976-4.975a2.185 2.185 0 0 0 0-3.09z" fill="#2CA9BC"/><path fill-rule="evenodd" clip-rule="evenodd" d="M0 3.5A3.5 3.5 0 0 1 3.5 0H7a.7.7 0 1 1 0 1.4H3.5a2.1 2.1 0 0 0-2.1 2.1v7c0 1.16.94 2.1 2.1 2.1h7a2.1 2.1 0 0 0 2.1-2.1V7A.7.7 0 0 1 14 7v3.5a3.5 3.5 0 0 1-3.5 3.5h-7A3.5 3.5 0 0 1 0 10.5v-7z" fill="#485356"/></svg>';
    const svgDictionary = '<svg class="image-btn dictionary-svg" width="15" height="14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.684 5.901a.786.786 0 0 0-.484-.57l-.867-.337v.891l.164.064a.236.236 0 0 1 .082.386L8.014 11.9a.393.393 0 0 1-.42.088l-1.237-.48v.89l.868.338a1.335 1.335 0 0 0 1.428-.3l5.817-5.817a.785.785 0 0 0 .213-.717zM.888 8.254c.039-.542.213-1.253.817-1.22l5.519 2.147a1.335 1.335 0 0 0 1.43-.303l5.334-5.37a.785.785 0 0 0-.272-1.284L8.231.09a1.335 1.335 0 0 0-1.43.303L.62 6.614C.134 7.015 0 7.765 0 8.431c0 .666.044 1.465.8 1.776l-.178-.042 1.663.647v-.595c0-.097.012-.191.032-.284L1.199 9.5C.843 9.365.843 8.881.888 8.254z" fill="#2CA9BC"/><path d="M3.19 9.776a.627.627 0 0 0-.184.442v2.759l1.172-.251L5.639 14v-2.758c0-.166.066-.325.184-.442l.467-.468-2.633-1.024-.468.468z" fill="#485356"/></svg>';
    const svgFeatures = '<svg class="image-btn features-svg" width="12" height="12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.077 0H.462C.185 0 0 .185 0 .462v4.615c0 .277.185.461.462.461h4.615c.277 0 .461-.184.461-.461V.462C5.538.185 5.354 0 5.077 0zM5.077 6.461H.462c-.277 0-.462.185-.462.462v4.615c0 .277.185.461.462.461h4.615c.277 0 .461-.184.461-.461V6.923c0-.277-.184-.462-.461-.462zM11.539 0H6.923c-.276 0-.461.185-.461.462v4.615c0 .277.185.461.461.461h4.616c.277 0 .461-.184.461-.461V.462C12 .185 11.816 0 11.54 0z" fill="#2CA9BC"/><path d="M11.077 8.769H9.692V7.384c0-.277-.185-.461-.462-.461-.276 0-.461.184-.461.461V8.77H7.384c-.277 0-.461.185-.461.461 0 .277.184.462.461.462H8.77v1.385c0 .277.185.461.461.461.277 0 .462-.184.462-.461V9.692h1.385c.277 0 .461-.185.461-.462 0-.276-.184-.461-.461-.461z" fill="#485356"/></svg>';
    const svgBagList = '<svg class="image-btn baglist-svg" width="14" height="14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 3.514h1.475L5.335.94A.7.7 0 1 0 4.007.494L3 3.514zM8.243.394a.717.717 0 0 0-.041.547l.86 2.573h1.475L9.565.494a.717.717 0 0 0-1.322-.1z" fill="#485356"/><path d="M13.825 4.457a.7.7 0 0 0-.532-.244H.708a.7.7 0 0 0-.699.81l1.307 7.81A1.398 1.398 0 0 0 2.715 14h8.6a1.398 1.398 0 0 0 1.398-1.168l1.28-7.808a.7.7 0 0 0-.168-.567zm-8.922 6.047a.699.699 0 0 1-1.398 0V7.708a.7.7 0 0 1 1.398 0v2.796zm2.797 0a.699.699 0 0 1-1.398 0V7.708a.7.7 0 0 1 1.398 0v2.796zm2.796 0a.699.699 0 1 1-1.398 0V7.708a.7.7 0 0 1 1.398 0v2.796z" fill="#2CA9BC"/></svg>';
    const svgCopy = '<svg class="image-btn copy-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path opacity=".4" d="M17.0998 2h-4.2C9.44976 2 8.04977 3.37 8.00977 6.75h3.09003c4.2 0 6.15 1.95 6.15 6.15v3.09c3.38-.04 4.75-1.44 4.75-4.89V6.9c0-3.5-1.4-4.9-4.9-4.9Z" fill="#2CA9BC"/><path d="M11.1 8H6.9C3.4 8 2 9.4 2 12.9v4.2C2 20.6 3.4 22 6.9 22h4.2c3.5 0 4.9-1.4 4.9-4.9v-4.2C16 9.4 14.6 8 11.1 8Zm1.19 5.65-3.71 3.71c-.14.14-.32.21-.51.21s-.37-.07-.51-.21L5.7 15.5c-.28-.28-.28-.73 0-1.01s.73-.28 1.01 0l1.35 1.35 3.21-3.21c.28-.28.73-.28 1.01 0s.29.74.01 1.02Z" fill="#2CA9BC"/></svg>';
    const svgComplex = '<svg class="image-btn complex-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2CA9BC" xmlns="http://www.w3.org/2000/svg"><path d="M15 12c0 1.6569-1.3431 3-3 3s-3-1.3431-3-3 1.3431-3 3-3 3 1.3431 3 3Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12.9046 3.06005C12.6988 3 12.4659 3 12 3s-.6988 0-.9046.06005c-.3012.08789-.5673.26803-.7608.51506-.1322.16877-.2187.38505-.39169.81761-.24872.6218-.93898.94199-1.57434.73028l-.57078-.19019c-.40489-.13496-.60734-.20245-.80583-.21401-.29157-.01699-.58176.05152-.83495.1971-.17236.09911-.32325.25001-.62504.5518-.32075.32075-.48113.48112-.58301.66419-.14969.26895-.21301.57745-.18137.88362.02153.20839.10576.41898.27423.84015.26383.65957.01002 1.41312-.5991 1.77867l-.27751.16654c-.4249.25493-.63735.38243-.79167.55793-.13656.1553-.23953.3372-.30245.5342C3 11.1156 3 11.3658 3 11.8663c0 .5926 0 .8888.09462 1.1425.08361.2241.2196.4249.39662.5858.20034.182.47271.291 1.01742.5089.55668.2226.8433.8406.6537 1.4094l-.21515.6455c-.14902.447-.22354.6706-.23031.8902-.00815.2641.05359.5256.17897.7581.10428.1935.27091.3601.60413.6933.33323.3332.49985.4998.69325.6041.23255.1254.49408.1872.75815.179.21962-.0068.44316-.0813.89024-.2303l.52698-.1757c.63531-.2117 1.32558.1084 1.57429.7302.17299.4325.25949.6488.39169.8176.1935.247.4596.4272.7608.5151.2058.06.4387.06.9046.06s.6988 0 .9046-.06c.3012-.0879.5673-.2681.7608-.5151.1322-.1688.2187-.3851.3917-.8176.2487-.6218.939-.9419 1.5742-.73l.5266.1756c.4471.149.6707.2235.8903.2303.2641.0081.5256-.0536.7581-.179.1934-.1043.3601-.2709.6933-.6041.3332-.3332.4998-.4999.6041-.6933.1254-.2325.1871-.4941.179-.7581-.0068-.2196-.0813-.4432-.2303-.8903l-.215-.645c-.1897-.569.097-1.1872.6539-1.4099.5447-.2179.8171-.3269 1.0175-.5089.177-.1609.313-.3617.3966-.5858C21 12.7551 21 12.4589 21 11.8663c0-.5005 0-.7507-.0711-.9733-.0629-.197-.1659-.3789-.3024-.5342-.1544-.1755-.3668-.303-.7917-.55793l-.2779-.16671c-.6091-.36549-.863-1.11902-.5991-1.77858.1684-.42115.2527-.63175.2742-.84015.0316-.30617-.0317-.61466-.1814-.88362-.1019-.18306-.2622-.34344-.583-.66419-.3018-.30178-.4527-.45268-.625-.55179-.2532-.14559-.5434-.21409-.835-.19711-.1985.01157-.4009.07905-.8058.21401l-.5704.19014c-.6353.21177-1.3256-.10837-1.5743-.73015-.173-.43256-.2595-.64884-.3917-.81761-.1935-.24703-.4596-.42717-.7608-.51506Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    const svgGeneration = '<svg class="image-btn generation-svg" width="16" height="16" svg fill="#2CA9BC" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 529.987 529.988" xml:space="preserve" stroke="#2CA9BC"><path d="M417.369 15.13c-20.157-9.62-132.564 153.382-132.564 153.382s-.622 26.67 7.152 47.946c7.048.297 13.875 1.922 20.312 5.001 9.294 4.437 16.639 11.303 21.735 19.45 23.361-5.853 47.449-26.259 47.449-26.259s56.084-189.891 35.916-199.52zM337.207 290.731c-.086.182-.144.373-.229.563-6.234 13.054-17.643 22.702-31.04 27.12-6.799 21.4-5.345 47.448-5.345 47.448S418.307 525.079 438.14 514.79c19.832-10.279-42.468-198.23-42.468-198.23s-32.512-25.753-58.465-25.829zM.004 260.867c-1.081 22.309 192.713 62.94 192.713 62.94s34.272-13.454 49.218-33.736c-5.422-12.163-6.226-26.287-1.349-39.474-14.392-19.364-42.696-33.765-42.696-33.765S1.085 238.558.004 260.867zM251.068 250.281c-2.008 4.208-3.107 8.654-3.672 13.148-.603 4.752-.392 9.543.641 14.287.383 1.769.698 3.557 1.31 5.298 3.806 10.776 11.6 19.431 21.917 24.365 5.824 2.782 12.021 4.188 18.418 4.188 7.851 0 15.386-2.237 21.927-6.139 5.183-3.089 9.696-7.248 13.196-12.259 1.319-1.894 2.534-3.863 3.548-5.977 7.229-15.138 4.6-32.369-5.098-44.772-3.939-5.049-8.931-9.371-15.099-12.316-3.662-1.75-7.507-2.754-11.418-3.404-2.313-.382-4.628-.784-7-.784-16.418-.01-31.603 9.563-38.67 24.365zM117.155 370.329l-8.243 4.849c21.209 36.099 52.479 64.757 90.413 82.868 11.877 5.671 24.26 10.146 36.873 13.493l-22.252 31.967 97.997-30.953-91.638-46.531 17.117 35.955c-11.619-3.156-23.017-7.335-33.976-12.565-36.213-17.29-66.048-44.629-86.291-79.083zM452.961 144.673l7.344 102.51 21.832-32.943c13.301 46.885 9.371 96.514-11.753 140.75-3.175 6.646-6.751 13.196-10.643 19.469l8.138 5.03c4.063-6.569 7.812-13.426 11.14-20.388 22.357-46.827 26.354-99.43 11.877-149.012l39.092 2.61-77.027-68.026zM145.278 116.75l-15.855-36.099-24.709 99.756 87.497-53.914-38.996-4.093c29.434-27.396 67.024-45.737 106.995-51.724l-1.415-9.457c-42.515 6.371-82.477 26.079-113.517 55.531z"/></svg>';

    // Функция для создания кнопки
    function createButton(id, name, iconPosition, iconHTML) {
        let button = document.createElement("button");
        button.type = "button";
        button.id = id;
        button.className = 'custom-btn ' + (iconPosition === 'left' ? 'pos-left' : 'pos-right');
        button.innerHTML = (iconPosition === 'left' ? iconHTML + ' ' + name : name + ' ' + iconHTML);
        return button;
    }

    // Добавление кнопок для Prodcuts Page
    let buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-container';
    let buttonTarget = document.createElement('div');
    buttonTarget.className = 'button-target';
    buttonContainer.appendChild(buttonTarget);

    let pageElement = document.getElementById('page');
    if (pageElement) {
        if (pageElement.firstChild) {
            pageElement.insertBefore(buttonContainer, pageElement.firstChild);
        } else {
            pageElement.appendChild(buttonContainer);
        }
    } else {
        console.error("Элемент с id 'page' не найден.");
    }

    // Функция для добавления кнопки относительно определенного элемента
    function addButtonRelativeElement(button, selector, position) {
        let target = document.querySelector(selector);
        if (target) {
            if (position === 'before') {
                target.parentNode.insertBefore(button, target);
            } else if (position === 'after') {
                target.parentNode.insertBefore(button, target.nextSibling);
            }
        } else {
            console.warn(`Element with selector "${selector}" not found.`);
        }
    }

    // Создание и добавление кнопок

    let button22 = createButton('linkToGeneration', 'Generation', 'left', svgGeneration);
    addButtonRelativeElement(button22, '.button-target', 'after');

    let button15 = createButton('linkToBagListFromProducts', 'BagList', 'left', svgBagList);
    addButtonRelativeElement(button15, '.button-target', 'after');

    let button16 = createButton('linkToComplexFromProducts', 'Complex', 'left', svgComplex);
    addButtonRelativeElement(button16, '.button-target', 'after');

    let button17 = createButton('linkToFeaturesFromProducts', 'Features', 'left', svgFeatures);
    addButtonRelativeElement(button17, '.button-target', 'after');

    let button18 = createButton('linkToDictionaryFromProducts', 'Dictionary', 'left', svgDictionary);
    addButtonRelativeElement(button18, '.button-target', 'after');

    let button19 = createButton('linkToEditFromProducts', 'Edit', 'left', svgEdit);
    addButtonRelativeElement(button19, '.button-target', 'after');

    let button20 = createButton('copyCdnFromProducts', 'Copy CDN', 'left', svgCopy);
    addButtonRelativeElement(button20, '.button-target', 'after');

    let button21 = createButton('copyLinkFromProducts', 'Copy Link', 'left', svgCopy);
    addButtonRelativeElement(button21, '.button-target', 'after');



    /********************** Кнопки для Products Page ***********************/
    const baseDomain = window.location.origin;
    function openLink(url) {
        window.open(url, '_blank').focus();
    }
    // Функция для копирования текста в буфер обмена
    function copyText(text) {
        navigator.clipboard.writeText(text).then(() => {
            console.log('Ссылка скопирована в буфер обмена');
        }).catch(err => {
            alert('Ошибка при копировании: ' + err);
        });
    }
    // Получение значений ID
    function getValues() {
        const retailerId = document.querySelector('#retailersDropdown option:checked')?.value;
        const categoryId = document.querySelector('#CategoryId option:checked')?.value;
        const genderId = document.querySelector('#editTagsDialog input.tagCheckbox:checked')?.getAttribute('data-tag-id');
        const externalIdValue = document.getElementById('ExternalId') ? document.getElementById('ExternalId').value : '';
        const retailerDomainValue = document.getElementById('RetailerDomain') ? document.getElementById('RetailerDomain').value : '';
        return { retailerId, categoryId, genderId, externalIdValue, retailerDomainValue };
    }
    // Обработчики для копирования и перехода по ссылкам
    const handlers = [
        {
            id: 'copyLinkFromProducts',
            action: () => {
                const regex = /^(https?:\/\/[^\/]+\/[^?]+)\/\d+/;
                const match = window.location.href.match(regex);
                if (match) {
                    copyText(match[0]);
                } else {
                    alert('Не удалось извлечь URL');
                }
            }
        },
        {
            id: 'linkToGeneration',
            action: () => {
                const idMatch = window.location.href.match(/\/(\d+)(\?.*)?$/);
                const productId = idMatch ? idMatch[1] : '';
                if (productId) {
                    openLink(`http://tngtest.westus.cloudapp.azure.com:1666/ProductInfo/Info?id=${productId}`);
                } else {
                    alert('ID продукта не найден в URL');
                }
            }
        },
        {
            id: 'copyCdnFromProducts',
            action: () => {
                const { externalIdValue, retailerDomainValue } = getValues();
                // Предполагаемая обработка разделения домена и пути, если необходимо
                let path = retailerDomainValue.split('/').slice(1).join('/');
                const encodedDomain = encodeURIComponent(retailerDomainValue.split('/')[0]);
                const encodedPath = path ? '/' + path : ''; // Если есть путь, добавляем его без кодирования
                const link = `https://cdn.tangiblee.com/widget/index.html?id=${encodeURIComponent(externalIdValue)}&domain=${encodedDomain}${encodedPath}&mode=admin-preview&directLink=1`;
                copyText(link);
            }
        },
        {
            id: 'linkToEditFromProducts',
            action: () => {
                const { retailerId } = getValues();
                openLink(`${baseDomain}/Admin/Retailer/Edit/${retailerId}`);
            }
        },
        {
            id: 'linkToDictionaryFromProducts',
            action: () => {
                const { retailerId } = getValues();
                openLink(`${baseDomain}/Admin/Retailer/EditFaceliftFrontSettings/${retailerId}`);
            }
        },
        {
            id: 'linkToFeaturesFromProducts',
            action: () => {
                const { retailerId } = getValues();
                openLink(`${baseDomain}/Admin/Retailer/Configure/${retailerId}`);
            }
        },
        {
            id: 'linkToBagListFromProducts',
            action: () => {
                const { retailerId, categoryId, genderId } = getValues();
                let bagListUrl = `${baseDomain}/Admin/CompareBag/BagList?page=1&pageSize=20`;
                if (retailerId) {
                    bagListUrl += `&retailers=${retailerId}`;
                }
                if (categoryId) {
                    bagListUrl += `&categories=${categoryId}`;
                }
                if (genderId) {
                    bagListUrl += `&gender=${genderId}`;
                }
                bagListUrl += `&sort=12`;
                openLink(bagListUrl);
            }
        },
        {
            id: 'linkToComplexFromProducts',
            action: () => {
                const { retailerId, categoryId, genderId } = getValues();
                openLink(`${baseDomain}/Admin/Configuration/Complex?RetailerId=${retailerId}&CategoryId=${categoryId}&TagId=${genderId}`);
            }
        }
    ];

    // Установка обработчиков событий
    handlers.forEach(({ id, action }) => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('click', action);
        }
    });

})();