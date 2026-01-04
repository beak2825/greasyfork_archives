// ==UserScript==
// @name         Shop Toolbar
// @namespace    http://tampermonkey.net/
// @version      1.12
// @description  Toolbar for CMS.S3 | centrclimat.ru
// @author       vertopolkaLF
// @match        */my/s3/*
// @match        https://new56ab3abe302a4.amocrm.ru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=centrclimat.ru
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/492240/Shop%20Toolbar.user.js
// @updateURL https://update.greasyfork.org/scripts/492240/Shop%20Toolbar.meta.js
// ==/UserScript==

(function() {
    'use strict';



    // Add style
    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css.replace(/;/g, ';');
        head.appendChild(style);
    }

    // Adds Functions

    function selectValue(query, valueToSelect) {
        let element = document.querySelector(query);
        element.value = valueToSelect;
    }

    function getEl(query){
        return document.querySelector(query);
    }

    function triggerEvent(el, type) {
        // IE9+ and other modern browsers
        if ('createEvent' in document) {
            var e = document.createEvent('HTMLEvents');
            e.initEvent(type, false, true);
            el.dispatchEvent(e);
        } else {
            // IE8
            var e = document.createEventObject();
            e.eventType = type;
            el.fireEvent('on' + e.eventType, e);
        }
    }

    function wait(ms)
    {
        var d = new Date();
        var d2 = null;
        do { d2 = new Date(); }
        while(d2-d < ms);
    }

    function waitForElm(selector) {
        return new Promise(resolve => {
            if(typeof selector === 'string'){
                if (document.querySelector(selector)) {
                    return resolve(document.querySelector(selector));
                }

                const observer = new MutationObserver(mutations => {
                    if (document.querySelector(selector)) {
                        resolve(document.querySelector(selector));
                        observer.disconnect();
                    }
                });

                observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });
            } else {
                if (selector) {
                    return resolve(selector);
                }

                const observer = new MutationObserver(mutations => {
                    if (selector) {
                        resolve(selector);
                        observer.disconnect();
                    }
                });

                observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });
            }
        });
    }

    function insertAfter(newNode, existingNode) {
        existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
    }

    async function getClipboard() {
        const text = await navigator.clipboard.readText();
        return text;
    }

    function inputValue(a, b){
        if (b){
            a.value = b;
        }
        a.dispatchEvent(new Event('input', { 'bubbles': true }))
    }

    // CMS.S3
    if (window.location.href.indexOf("my/s3") > -1) {


        addGlobalStyle("div.toolbar{ position: fixed; right: 0; bottom: 20px; background: #555; z-index: 100000; display: flex; flex-direction: column; gap: 5px; align-items: center; padding: 7px; border-radius: 10px 0 0 10px; box-shadow: 0 0 20px 10px #0003; } div.toolbar a{ width: 24px; height: 24px; background: #333; display: block; padding: 6px; border-radius: 5px; transition: .2s; cursor: pointer; } div.toolbar a:hover{ background: #25b02b; transform: scale(1.1); border-radius: 7px; transition: .2s; } div.toolbar a svg{ width: 100%; height: 100%; } div.toolbar a.active{ background: #e67811 !important; transition: .2s; }");


        // initialization

        const ToolbarDIV = document.createElement('div');

        document.querySelector("header.s3-header-new").insertBefore(ToolbarDIV, document.querySelector("div.user-block"));
        ToolbarDIV.classList.add('toolbar');



        const amoInfo = document.createElement('a');
        amoInfo.id = 'amoInfo';
        amoInfo.innerHTML = `<svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7.61593 14.4684C7.61593 16.0125 8.21298 16.7836 9.40551 16.7836C10.6818 16.764 11.7393 16.1122 12.5765 14.8297C12.8695 14.3893 13.1102 13.8482 13.2986 13.2059C13.2986 10.9619 13.5079 9.03858 13.9271 7.43437C12.2312 7.75551 10.7555 8.53707 9.4997 9.77906C8.24385 11.022 7.61593 12.5857 7.61593 14.4684ZM22.4349 12.6648C22.8116 12.6648 23 13.1268 23 14.0476C23 14.5486 22.7802 15.1553 22.3412 15.8667C21.9017 16.5782 21.3308 17.23 20.6296 17.8206C19.9279 18.4118 19.1488 18.8983 18.2906 19.2791C17.4324 19.6593 16.5952 19.8492 15.7789 19.8492C14.6691 19.8492 13.9271 18.9178 13.5498 17.0536C13.0051 17.9158 12.2934 18.6222 11.4149 19.1733C10.5358 19.7249 9.35841 20 7.8828 20C6.40666 20 5.21937 19.5596 4.31935 18.6769C3.41933 17.7956 2.97978 16.7229 3.00071 15.4604C3.00071 12.0546 4.18277 9.36924 6.54847 7.40431C7.55366 6.58317 8.48979 6.04208 9.35841 5.78156C10.227 5.52104 11.1428 5.39028 12.1056 5.39028C13.0684 5.39028 13.8533 5.5511 14.4603 5.87124C14.7533 5.29058 15.0882 5 15.4649 5C16.1975 5 16.8935 5.30511 17.5528 5.91683C18.2121 6.52856 18.5423 7.10371 18.5423 7.64479C18.2482 8.30661 17.8197 9.0982 17.2545 10.02C17.0871 10.9414 17.0028 12.2345 17.0028 13.8978C17.0028 15.5616 17.2231 16.3923 17.6627 16.3923C18.2069 16.3923 19.5255 15.3512 21.6186 13.267C21.9953 12.8657 22.2674 12.6648 22.4349 12.6648Z" fill="white"/>
</svg>`;
        amoInfo.setAttribute('title', 'Экспорт заказа в AmoCRM');
        ToolbarDIV.appendChild(amoInfo);


        const split = document.createElement('span');
        split.id = "split";
        ToolbarDIV.appendChild(split);

        const saveBtn = document.createElement('a');
        saveBtn.id = 'saveBtn';
        saveBtn.innerHTML = `<svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M19.5466 21.1252H5.54663C5.0162 21.1252 4.50749 20.9145 4.13242 20.5395C3.75734 20.1644 3.54663 19.6557 3.54663 19.1252V5.12524C3.54663 4.59481 3.75734 4.0861 4.13242 3.71103C4.50749 3.33596 5.0162 3.12524 5.54663 3.12524H16.5466L21.5466 8.12524V19.1252C21.5466 19.6557 21.3359 20.1644 20.9608 20.5395C20.5858 20.9145 20.0771 21.1252 19.5466 21.1252Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M17.5466 21.1252V13.1252H7.54663V21.1252" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M7.54663 3.12524V8.12524H15.5466" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;
        saveBtn.setAttribute('title', 'Сохранить и закрыть');
        ToolbarDIV.appendChild(saveBtn);




        const newCopyBtn = document.createElement('a');
        newCopyBtn.id = 'newCopy';
        newCopyBtn.innerHTML = `<svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12.3765 2.05566V6.05566" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M12.3765 18.0557V22.0557" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M5.30664 4.9856L8.13664 7.8156" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M16.6167 16.2957L19.4467 19.1257" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M2.37646 12.0557H6.37646" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M18.3765 12.0557H22.3765" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M5.30664 19.1257L8.13664 16.2957" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M16.6167 7.8156L19.4467 4.9856" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;
        newCopyBtn.setAttribute('title', 'Очистка URL, SEO, кол-во и Отображение');
        ToolbarDIV.appendChild(newCopyBtn);

        const makeModBtn = document.createElement('a');
        makeModBtn.id = 'makeMod';
        makeModBtn.innerHTML = `<svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M20.2711 9.17508H11.2711C10.1666 9.17508 9.27113 10.0705 9.27113 11.1751V20.1751C9.27113 21.2796 10.1666 22.1751 11.2711 22.1751H20.2711C21.3757 22.1751 22.2711 21.2796 22.2711 20.1751V11.1751C22.2711 10.0705 21.3757 9.17508 20.2711 9.17508Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M5.27113 15.1751H4.27113C3.74069 15.1751 3.23198 14.9644 2.85691 14.5893C2.48184 14.2142 2.27113 13.7055 2.27113 13.1751V4.17508C2.27113 3.64465 2.48184 3.13594 2.85691 2.76087C3.23198 2.38579 3.74069 2.17508 4.27113 2.17508H13.2711C13.8016 2.17508 14.3103 2.38579 14.6853 2.76087C15.0604 3.13594 15.2711 3.64465 15.2711 4.17508V5.17508" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;
        makeModBtn.setAttribute('title', 'Создать # модификаций');
        ToolbarDIV.appendChild(makeModBtn);

        const archiveBtn = document.createElement('a');
        archiveBtn.id = 'archive';
        archiveBtn.innerHTML = `<svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_5_40)">
<path d="M21.7931 8.44827V21.4483H3.79312V8.44827" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M23.7931 3.44827H1.79312V8.44827H23.7931V3.44827Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M10.7931 12.4483H14.7931" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</g>
<defs>
<clipPath id="clip0_5_40">
<rect width="24" height="24" fill="white" transform="translate(0.793121 0.448273)"/>
</clipPath>
</defs>
</svg>
`;
        archiveBtn.setAttribute('title', 'Архивировать выбранные товары');
        ToolbarDIV.appendChild(archiveBtn);

        const quickPrice = document.createElement('a');
        quickPrice.id = 'quickPrice';
        quickPrice.innerHTML = `<svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12.1641 22.0557C17.6869 22.0557 22.1641 17.5785 22.1641 12.0557C22.1641 6.53282 17.6869 2.05566 12.1641 2.05566C6.64121 2.05566 2.16406 6.53282 2.16406 12.0557C2.16406 17.5785 6.64121 22.0557 12.1641 22.0557Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M12.5664 16.0556C10.3573 16.0556 8.56641 14.2647 8.56641 12.0556C8.56641 9.84646 10.3573 8.0556 12.5664 8.0556M12.5664 16.0556C13.5124 16.0556 14.3816 15.7272 15.0664 15.1783M12.5664 16.0556V17.3113M12.5664 8.0556C13.5124 8.0556 14.3816 8.38395 15.0664 8.93291M12.5664 8.0556V6.80493" stroke="white" stroke-width="2" stroke-linecap="round"/>
</svg>
`;
        quickPrice.setAttribute('title', 'Режим быстрой смены цены');
        ToolbarDIV.appendChild(quickPrice);


        saveBtn.addEventListener('click', saveEdit);
        newCopyBtn.addEventListener('click', newCopy);
        makeModBtn.addEventListener('click', makeMod);
        archiveBtn.addEventListener('click', archiveSelected);
        quickPrice.addEventListener('click', toggleQuickPrice);
        amoInfo.addEventListener('click', getAmoInfo);





        var quickPriceToggled = 0;
        // Button functions

        function saveEdit(){
            if ( getEl('div#ajaxPopupWindow_0 div.bluepopup-wrapper.with-tabs') != null && document.querySelector('div#ajaxPopupWindow_0 div.bluepopup-wrapper.with-tabs span.title').innerHTML == 'Товар' || getEl('div#ajaxPopupWindow_0 div.bluepopup-wrapper.with-tabs') != null && document.querySelector('div#ajaxPopupWindow_0 div.bluepopup-wrapper.with-tabs span.title').innerHTML == 'Товар – Модификация'){
                getEl('div.popup-buttons button.s3-btn-v2.without-margin.green').click();
            } else if (getEl('form.shop2-full-search') != null) {
                getEl('form.shop2-full-search button.s3-btn-v2.without-margin.green').click();
            }
        }

        function newCopy(){
            if ( getEl('div#ajaxPopupWindow_0 div.bluepopup-wrapper.with-tabs') != null && document.querySelector('div#ajaxPopupWindow_0 div.bluepopup-wrapper.with-tabs span.title').innerHTML == 'Товар' || getEl('div#ajaxPopupWindow_0 div.bluepopup-wrapper.with-tabs') != null && document.querySelector('div#ajaxPopupWindow_0 div.bluepopup-wrapper.with-tabs span.title').innerHTML == 'Товар – Модификация'){
                getEl("li.tabs-submenu-item:nth-child(1) a").click();
                selectValue("label > div.form-item-title + select", '0');
                if (getEl("input#master_kind_amount")) {getEl("input#master_kind_amount").value = '100'; }
                if (getEl("input#amount")) {getEl("input#amount").value = '100'; }
                getEl("li.tabs-submenu-item:nth-child(2) a").click();
                getEl("input#seo_url").value = '';
                getEl("li.tabs-submenu-item:nth-child(3) a").click();
                selectValue("select#seo_noindex", '0');
                document.querySelectorAll('div#tab-seo-fields textarea').forEach(seo => {
                    seo.value = '';
                });
                getEl("li.tabs-submenu-item:nth-child(1) a").click();
            } else {
                alert('Сначала откройте товар');
            }
        }

        function archiveSelected(){
            if ( getEl('table.products-list label.s3-cb.active') != null ){
                selectValue('select#product-selector__actions', 'Shop2Controller.groupEditing(2162021);');
                s3.applySelectedAction(util.getObject('product-selector__actions'));
                selectValue('select#folder_mode', 'set');
                getEl('div#foldercontent_control').style.display = 'block';
                treeController.load('select',39,2162021,this,folderController.select,'',0,null,true, null);

                waitForElm("div#ajaxPopupWindow_1").then((elm) => {
                    getEl('div.bluepopup-wrapper div#dynatree-id-713410421 span.dynatree-expander').click();
                });

                waitForElm("label[onclick='folderController.click(218099300, this);']").then((elm) => {
                    console.log('Element is ready');
                    folderController.click(218099300, getEl("label[onclick='folderController.click(218099300, this);']"));
                    popupController.closeLastPopup();
                    selectValue('select#flag_164611', '1');
                    selectValue('select#noindex', '0');
                    getEl('select#hidden').value = '2';
                    getEl('input#price').value = '0';
                    getEl('input#amount').value = '0';
                    getEl('div#ajaxPopupWindow_0 div.popup-buttons button[type="submit"].s3-btn-save.green').click();
                });
            } else {
                alert('Не выбран не один элемент');
            }
        }

        function toggleQuickPrice(){
            if( quickPriceToggled == 0) {
                quickPriceToggled = 1;
                quickPrice.classList.add("active");
            } else {
                quickPriceToggled = 0;
                quickPrice.classList.remove("active");
            }
            waitForElm('form#shop2_search').then((elm) => {
                getEl('form#shop2_search').addEventListener('submit', quickPriceEdit);
                getEl('table.products-list').classList.add('marked');
            });
        }

        var i;

        function makeMod() {
            let modAmount = prompt("Сколько модификаций", "");
            if (modAmount == 0 || modAmount =="" || modAmount == null){} else {
                for (const a of document.querySelectorAll("span.objectAction")) {
                    if (a.textContent.includes("Дублировать основную модификацию")) {
                        var modBtn = a;
                    }
                }
                for (i = 1; i <= modAmount; i++) {
                    modBtn.click();
                }
            }
        }

        function afterLoad() {
            var priceInput = document.querySelectorAll("#shop2_products_container span.price[data-access='shop2_product.edit_price']")[0].querySelector("input")
            let priceValue = prompt("Укажите цену", "");
            if (priceValue == 0 || priceValue =="" || priceValue == null){} else {
                priceInput.value = priceValue;
                priceInput.dispatchEvent(new Event('input', {
                    view: window,
                    bubbles: true,
                    cancelable: true
                }))
                wait(100);
                triggerEvent(priceInput, 'change');
            }
        }

        function quickPriceEdit(){
            if (quickPriceToggled == 1){
                waitForElm('table.products-list:not(.marked) > tbody > tr:last-child').then((elm) => {
                    setTimeout(afterLoad, 100);
                });
            } else {}
            getEl('form#shop2_search').addEventListener('submit', quickPriceEdit);
            getEl('table.products-list').classList.add('marked');
        }

        var elFound;

        function fixArchive() {
            var catId = getEl('div.dynatree-node.active span.dynatree-folder-id').innerHTML; // cat value
            getEl('input.cb-product-selector').click();
            Shop2Controller.groupChooseMainCategory(2162021);
            getEl(`label.s3-cb input[value="${catId}"]`).click();
            document.querySelector('div.bluepopup-wrapper * input[name="submit"]').click();

            document.querySelectorAll('div.bluepopup-wrapper span.title').forEach( el => {
                console.log(el);
                if (el.innerText == 'Групповые операции'){
                    elFound = el; console.log(elFound);
                }
            });
            waitForElm(elFound).then((elm) => {
                popupController.closeLastPopup();
                popupController.closeLastPopup();
            });

        }

        function removeArch(){
            getEl('input.cb-product-selector').click();
            Shop2Controller.groupResetCategory(2162021);
            getEl(`label.s3-cb input[value="218099300"]`).click();
            document.querySelector('div.bluepopup-wrapper * input[name="submit"]').click();
            waitForElm('div#confirm').then((elm) => {
                document.querySelector('span#confirm_submit').click();
            });

            document.querySelectorAll('div.bluepopup-wrapper span.title').forEach( el => {
                console.log(el);
                if (el.innerText == 'Групповые операции'){
                    elFound = el; console.log(elFound);
                }
            });
            waitForElm(elFound).then((elm) => {
                popupController.closeLastPopup();
                popupController.closeLastPopup();
            });
        }

        function getAmoInfo() {

            var leadName = '', leadBudget = '', orderDelivery = '', orderAdress = '', orderComment = '', orderNumber = '', orderLink = '', contactName = '', contactPhone = '', contactEmail = '';


            leadName = getEl("div.bluepopup-wrapper h4").textContent.trim();

            leadBudget = document.querySelectorAll('.shop2-order-table')[3].querySelector('tr:last-child > td:nth-child(2)').textContent.split('.')[0].trim();

            orderDelivery = document.querySelectorAll('.shop2-order-table')[2].querySelector('tr:nth-child(2) > td:nth-child(2)').textContent.trim();
            if (document.querySelectorAll('.shop2-order-table')[2].querySelector('tr:nth-child(3) > td:nth-child(2)') ){
                orderAdress = document.querySelectorAll('.shop2-order-table')[2].querySelector('tr:nth-child(3) > td:nth-child(2)').textContent.trim();
            }
            orderComment = getEl('table.shop2-order-table tr:nth-child(4) td:nth-child(2)').textContent.trim();

            orderNumber = getEl("div.bluepopup-wrapper h4").textContent.trim().split('#')[1];
            orderLink = getEl("a[title='Посмотреть на сайте']").getAttribute('href');

            contactName = getEl('table.shop2-order-table tr:nth-child(1) td:nth-child(2)').textContent.trim();
            contactPhone = getEl("a.s3-phone-link").textContent.trim();
            contactEmail = getEl('table.shop2-order-table tr:nth-child(3) td:nth-child(2)').textContent.trim();



            var output = `${leadName};${leadBudget};${orderDelivery};${orderAdress};${orderComment};${orderNumber};${orderLink};${contactName};${contactPhone};${contactEmail}`;
            navigator.clipboard.writeText(output);
            console.log(output);
            setTimeout(() => {window.open('https://new56ab3abe302a4.amocrm.ru/leads/add/?pipeline_id=370668', '_blank').focus()}, 100);
        }

        document.onkeyup = function () {
            var e = e || window.event; // for IE to cover IEs window event-object
            if(e.altKey && e.which == 65) {
                fixArchive();
                return false;
            } else if(e.altKey && e.which == 83) {
                removeArch();
                return false;
            }
        }




        var lastCheckbox, lastCheckboxState, startCheckbox, curCheckbox, ichk, curChkElm, curChkElmVAR;

        function updateCheckbox(event){
            document.getSelection().removeAllRanges();

            if (event.target.name == 'product_id'){
                return false;
            }

            console.log('SHIFT = ' + event.shiftKey);
            if(event.shiftKey) {

                event.preventDefault();
                curCheckbox = Number(event.target.parentElement.id);
                console.log('CUR - ' + curCheckbox + '; LAST - ' + lastCheckbox);

                if (curCheckbox < lastCheckbox){
                    startCheckbox = curCheckbox;
                    ichk = lastCheckbox;
                } else {
                    startCheckbox = lastCheckbox;
                    ichk = curCheckbox;
                }

                for (var i = startCheckbox; i <= ichk; i++) {

                    curChkElmVAR = document.getElementById(i);
                    curChkElm = curChkElmVAR.querySelector('input');
                    console.log('CUR = ' + curChkElm.checked + '; LAST = ' + lastCheckboxState);
                    if (lastCheckboxState != curChkElm.checked) {
                        document.getElementById(i).querySelector('input').click();
                    }

                    if (document.getElementById(i).querySelector('input') == ichk) {
                        document.getElementById(i).querySelector('input').click();
                    }
                    console.log('checked ' + curChkElmVAR.id);
                }

                return false;
            }


            console.log(event.target);
            lastCheckbox = Number(event.target.parentElement.id);
            lastCheckboxState = !event.target.parentElement.querySelector('input').checked;
            console.log('update checkbox ' + lastCheckbox + ', state - ' + lastCheckboxState);

        }

        var chkSelector = 'span.checkbox.product-label label:not(.listened)';

        function newCheckboxS() {
            var n = 0;
            var checkboxS = document.querySelectorAll(chkSelector);
            checkboxS.forEach((x) => {
                x.id = n;
                x.addEventListener('click', updateCheckbox, false);
                x.classList.add('listened');
                n++;
            });
            console.log('checkboxes listened');
            waitForElm(chkSelector).then((elm) => {
                console.log('checkboxes detected');
                newCheckboxS();
            });
        }

        waitForElm(chkSelector).then((elm) => {
            console.log('checkboxes detected');
            newCheckboxS();
        });


        function reCenter(){
            document.querySelector("#ajaxPopupWindow_0").style.left = `${document.body.offsetWidth/2 - document.querySelector("#ajaxPopupWindow_0").offsetWidth/2}px`;
        }


        function reCenterList(){
            document.querySelector("#ajaxPopupWindow_0").classList.add('done');
            document.querySelectorAll(".tabs-submenu-item").forEach((e) => {
                e.addEventListener('click', reCenter);
                window.scrollTo(0, 0);
            });
            reCenterWait();
        }

        function reCenterWait(){
            waitForElm("#ajaxPopupWindow_0:not(.done)").then((elm) => {reCenterList();});
        }

        reCenterWait();



        // CMS.S3 END

    }

    if (window.location.href.indexOf("amocrm.ru") > -1) {
        console.log ("AMOCRM DETECTED");
        // initialization


        var CMS3;
        addGlobalStyle("div.toolbar{ position: fixed; right: 0; bottom: 20px; background: #153043; border: 1px solid #fff2; border-right: none; z-index: 100000; display: flex; flex-direction: column; gap: 5px; align-items: center; padding: 7px; border-radius: 10px 0 0 10px; box-shadow: 0 0 20px 10px #0003; } div.toolbar a{ width: 24px; height: 24px; background: #057fb1; display: block; padding: 6px; border-radius: 5px; transition: .2s; cursor: pointer; } div.toolbar a:hover{ background: #0095df; transform: scale(1.1); border-radius: 7px; transition: .2s; } div.toolbar a svg{ width: 100%; height: 100%; } div.toolbar a.active{ background: #e67811 !important; transition: .2s; }");


        const ToolbarAmoDIV = document.createElement('div');
        ToolbarAmoDIV.classList.add('toolbar');

        insertAfter(ToolbarAmoDIV, document.querySelector("body"));

        const amoInfo = document.createElement('a');
        amoInfo.id = 'amoInfo';
        amoInfo.innerHTML = `<svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_1425_83)">
<path fill-rule="evenodd" clip-rule="evenodd" d="M20.7648 10.7012C20.3448 9.53356 19.0164 8.58856 17.796 8.58856H6.17283C4.95243 8.58856 3.62283 9.53416 3.20403 10.7012L0.220225 18.4544C-0.00177468 19.0724 -0.0503747 19.6544 0.0498253 20.1644C0.0508768 20.1943 0.0548965 20.224 0.0618253 20.2532L0.0960253 20.396C0.399025 21.6818 1.14423 23.6 3.00003 23.6H21C22.7808 23.6 23.6328 21.581 23.9178 20.321L23.9328 20.2532C23.9356 20.2411 23.9378 20.2289 23.9394 20.2166C24.0534 19.6946 24.0096 19.0934 23.7798 18.4544L20.7642 10.7012H20.7648Z" fill="white"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M20.7648 10.7012C20.3448 9.53356 19.0164 8.58856 17.796 8.58856H6.17283C4.95243 8.58856 3.62283 9.53416 3.20403 10.7012L0.220225 18.4544C-0.00177468 19.0724 -0.0503747 19.6544 0.0498253 20.1644C0.0508768 20.1943 0.0548965 20.224 0.0618253 20.2532L0.0960253 20.396C0.399025 21.6818 1.14423 24.2 3.00003 24.2H21C22.7808 24.2 23.6328 21.581 23.9178 20.321L23.9328 20.2532C23.9356 20.2411 23.9378 20.2289 23.9394 20.2166C24.0534 19.6946 24.0096 19.0934 23.7798 18.4544L20.7642 10.7012H20.7648ZM23.0112 18.6212L20.2242 11.102C19.8672 10.1108 18.9396 9.19996 17.91 9.19996H6.30003C5.27103 9.19996 4.11363 10.112 3.75843 11.1008L1.00503 18.6146C0.390625 20.3258 1.29003 21.8 3.07863 21.8H20.9346C22.7226 21.8 23.6226 20.3252 23.0106 18.6218L23.0112 18.6212Z" fill="url(#paint0_linear_1425_83)"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M12.1152 19.6268C12.9972 19.5746 13.671 18.8036 13.62 17.9042L13.4094 14.204C13.4083 14.1852 13.4077 14.1664 13.4076 14.1476C13.4076 13.6136 13.8318 13.1816 14.3556 13.1816H14.433C14.973 13.1816 15.4398 13.5674 15.5514 14.1062L16.3272 17.8604C16.4832 18.6152 17.1366 19.1552 17.8932 19.1552H18.2838C18.4128 19.1552 18.5412 19.1348 18.6636 19.094C19.3074 18.8798 19.6596 18.1748 19.4496 17.5184L17.9832 12.9296C17.6154 11.7794 16.563 11 15.375 11H8.6328C7.4448 11 6.3918 11.78 6.0246 12.9308L4.5606 17.519C4.52054 17.6441 4.5001 17.7746 4.5 17.906C4.5 18.596 5.049 19.1552 5.7258 19.1552H6.1152C6.8718 19.1552 7.5252 18.6152 7.6812 17.8604L8.4564 14.1062C8.50789 13.847 8.6472 13.6135 8.85083 13.4451C9.05446 13.2766 9.30994 13.1836 9.5742 13.1816H9.6522C9.6702 13.1816 9.6882 13.1816 9.7062 13.1828C10.2294 13.214 10.6284 13.6706 10.5978 14.204L10.3878 17.9042C10.3859 17.9356 10.3849 17.967 10.3848 17.9984C10.3848 18.8996 11.1012 19.6298 11.985 19.6298C12.0534 19.6298 12.084 19.6286 12.1152 19.6268Z" fill="#444444"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M10.2936 7.3244L11.1174 15.3194C11.1516 15.7508 11.5404 16.091 12 16.091C12.4602 16.091 12.8484 15.7508 12.882 15.3194L13.707 7.3244H10.2936Z" fill="url(#paint1_linear_1425_83)"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M12.0264 10.0328C9.5502 10.0328 7.5426 7.96579 7.5426 5.41639C7.5426 2.86639 9.5502 0.799988 12.0264 0.799988C14.5026 0.799988 16.5102 2.86699 16.5102 5.41639C16.5102 7.96579 14.5026 10.0328 12.0264 10.0328Z" fill="url(#paint2_linear_1425_83)"/>
</g>
<defs>
<linearGradient id="paint0_linear_1425_83" x1="2.52934e-05" y1="8.58796" x2="2.52934e-05" y2="24.2" gradientUnits="userSpaceOnUse">
<stop stop-color="white"/>
<stop offset="1" stop-color="#B6BDC0"/>
</linearGradient>
<linearGradient id="paint1_linear_1425_83" x1="13.3302" y1="14.1572" x2="13.3302" y2="7.3244" gradientUnits="userSpaceOnUse">
<stop stop-color="#D6D6D6"/>
<stop offset="1" stop-color="#969696"/>
</linearGradient>
<linearGradient id="paint2_linear_1425_83" x1="7.0326" y1="4.39459" x2="11.4846" y2="9.19699" gradientUnits="userSpaceOnUse">
<stop stop-color="#00D691"/>
<stop offset="1" stop-color="#00AD58"/>
</linearGradient>
<clipPath id="clip0_1425_83">
<rect width="24" height="23.4" fill="white" transform="translate(0 0.799988)"/>
</clipPath>
</defs>
</svg>
`;
        ToolbarAmoDIV.appendChild(amoInfo);

        amoInfo.addEventListener('click', setAmoInfo);


        async function setAmoInfo(){
            // get info

            CMS3 = await navigator.clipboard.readText();
            CMS3 = CMS3.replace(/\t/g, '');
            CMS3 = CMS3.replace(/\n/g, '');
            CMS3 = CMS3.replace(/\r/g, '');
            console.log(CMS3);
            var orderarray = CMS3.split(';')
            console.log(orderarray);

            if (orderarray[0].includes('Заказ')) {


                // assign fields
                const leadName = document.querySelector('#person_n');

                const leadBudget = document.querySelector('input#lead_card_budget');

                const orderDelivery = document.querySelector('input[name="CFV[587662]"]');
                const orderAdress = document.querySelector('input[name="CFV[586428]"]');
                const orderComment = document.querySelector('input[name="CFV[426526]"]');

                const orderNumber = document.querySelector('input[name="CFV[587660]"]');
                const orderLink = document.querySelector('input[name="CFV[587658]"]');

                const contactName = document.querySelector('input#new_contact_n');
                const contactPhone = document.querySelector('input.control-phone__formatted');
                const contactEmail = document.querySelector('input[data-pei-code="email"]');

                const primInput = document.querySelector('input.js-control-contenteditable-input');

                const saveBTN = document.querySelector('button#save_and_close_contacts_link');

                var inputArray = [leadName, leadBudget, orderDelivery, orderAdress, orderComment, orderNumber, orderLink, contactName, contactPhone, contactEmail];

                console.log(inputArray);
                // Тег "Заказ с сайта"
                document.querySelector('div#add_tags input').click()
                waitForElm('li[data-id="1018202"]').then((elm) => {
                    document.querySelector('li[data-id="1018202"]').click();
                    document.body.click();



                    let arrayN = 0;

                    orderarray.forEach((element) => {
                        if (orderarray[arrayN].length != 0){
                            inputValue(inputArray[arrayN], orderarray[arrayN]);
                        }
                        arrayN++;
                    });

                    saveBTN.click();
                });
            } else {
                alert('Данные заказа не скопированы');
            }



        }


        function waitModal(){
            waitForElm('div.modal-body').then((elm) => {
                console.log('modal detected');
                if ((getEl('div.modal-body').innerHTML).includes("ответственным в связанных контактах  в соответствии с вашими правами?") == true){
                    getEl('.modal button.js-modal-accept.modal-body__actions__save').click();
                    console.log('button pressed');
                    triggerWait();
                } else {
                    triggerWait();
                }
            });
        }

        function triggerWait(){
            setTimeout(() => {
                waitModal();
            }, 3000);
        }

        triggerWait();



    }

})();

