// ==UserScript==
// @name         BitrixUI
// @license      MIT
// @namespace    http://tampermonkey.net/
// @version      0.8.3
// @description  Делает дизайн битрикса нормальным и убирает мусор
// @author       SY
// @match        *://rscable.bitrix24.ru/*
// @icon         data:image/gif;base64,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
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.7.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/470330/BitrixUI.user.js
// @updateURL https://update.greasyfork.org/scripts/470330/BitrixUI.meta.js
// ==/UserScript==
//Проверка портала
//dC_ = dealCard
console.log("Bitrix UI: Start");


const PortalURl = window.location.hostname;
const loadingTime = "3000";
if (PortalURl.includes("rscable.bitrix24.ru")) {
    //Настройка блока "Очистка главной стриницы"
    const DeleteListMainPageItem = [
        //Список удаления на странице /crm/deal/kanban/
        //".main-buttons-box", //верхняя панель
        ".header-item", //мой тариф пригласить
        // ".bx-im-users-wrap",    //список чатов
        ".help-block", //иконка помощи
    ];
    function MainKanban() {
        "use strict";
        DeleteListMainPageItem.forEach((del) => {
            //TODO переделать под класс нейм
            document.querySelector(del).remove();
        });
        window.scrollTo(0, document.body.scrollHeight);
    }

    //Настройка блока "Установка карточки в канбане" или dC_Kanban
    const dC_Kanban_padding = "8px 7px 7px 12px"; //отступы начинки карточки сделки в канбане

    async function dC_Kanban() {
        "use strict";
        let CardKanban = document.getElementsByClassName("crm-kanban-item"); //Ищет элементы по классу и возвращает колекцию
        CardKanban = Array.from(CardKanban);
        CardKanban.forEach((node) => {
            node.style.padding = dC_Kanban_padding;
        });
    }

    //Настройка блока "Настройка полей карточе в канбане" или dC_FieldKanban
    const dC_FieldKanban_display = "flex";
    const dC_FieldKanban_justufyContent = "space-between";
    const dC_FieldKanban_paddingBottom = "3px";
    const dC_FieldKanban_marginBottom = "1px";
    const dC_FieldKanban_textAlign = "right";
    const dC_DeleteListFieldsItem = [
        //Список удадения внутри карточки в канбане
        "crm-kanban-item-plan", // кнопка + Дело
        "crm-kanban-item-last-activity-by", // иконка профиля в углу
    ];
    async function dC_FieldKanban() {
        "use strict";
        let CardFieldItem = document.getElementsByClassName("crm-kanban-item-fields-item");
        CardFieldItem = Array.from(CardFieldItem);
        CardFieldItem.forEach((node) => {
            // console.log(node);
            node.style.display = dC_FieldKanban_display;
            node.style.justifyContent = dC_FieldKanban_justufyContent;
            node.style.paddingBottom = dC_FieldKanban_paddingBottom;
            node.style.marginBottom = dC_FieldKanban_marginBottom;
            node.style.textAlign = dC_FieldKanban_textAlign;
        });

        let CardField = document.getElementsByClassName("crm-kanban-item-fields");
        CardField = Array.from(CardField);
        CardField.forEach((node) => {
            node.style.paddingBottom = dC_FieldKanban_paddingBottom;
        });

        let CardFieldData = document.getElementsByClassName("crm-kanban-item-date");
        CardFieldData = Array.from(CardFieldData);
        CardFieldData.forEach((node) => {
            node.style.fontSize = "11px";
            node.style.color = "#8e8e8e9e";
            node.style.margin = "0 0 7px 0";
            node.style.position = "absolute";
            node.style.bottom = "1px";
        });

        dC_DeleteListFieldsItem.forEach((del) => {
            let CardFieldC_lean = document.getElementsByClassName(del);
            CardFieldC_lean = Array.from(CardFieldC_lean);
            CardFieldC_lean.forEach((item) => {
                item.remove();
            });
        });
    }

    //Настройка блока "Фрейм карточки сделки"
    const dC_Iframe_display = "flex";
    const dC_Iframe_flexWrap = "wrap";
    const dC_Iframe_margin = "0 5px 3px";
    const dC_IframeTitle_width = "111px";
    const dC_IframeContent_width = "370px";
    async function dC_IframeFields() {
        console.log("Field function Start");
        let iframe = document //.getElementsByTagName("iframe")[0].contentWindow.document;
        let iframeFields = iframe.getElementsByClassName("ui-entity-editor-content-block-click-editable");
        iframeFields = Array.from(iframeFields);
        iframeFields.forEach((node) => {
            node.style.display = dC_Iframe_display;
            node.style.dC_Iframe_flexWarp = dC_Iframe_flexWrap;
            // node.style.margin = dC_Iframe_margin;
        });

        let iframeFieldsMarginFix = iframe.getElementsByClassName("ui-entity-editor-content-block");
        iframeFieldsMarginFix = Array.from(iframeFieldsMarginFix);
        iframeFieldsMarginFix.forEach((node) => {
            node.style.margin = dC_Iframe_margin;
        });

        let iframeFieldsTitle = iframe.getElementsByClassName("ui-entity-editor-block-title");
        iframeFieldsTitle = Array.from(iframeFieldsTitle);
        iframeFieldsTitle.forEach((node) => {
            node.style.width = dC_IframeTitle_width;
        });

        let iframeWidget = iframe.getElementsByClassName("crm-entity-widget-content-block-inner");
        iframeWidget = Array.from(iframeWidget);
        iframeWidget.forEach((node) => {
            node.style.width = dC_IframeContent_width;
        });

        let iframeWidgetEmpl = iframe.getElementsByClassName("uf-employee-wrap");
        iframeWidgetEmpl = Array.from(iframeWidgetEmpl);
        iframeWidgetEmpl.forEach((node) => {
            node.style.width = dC_IframeContent_width;
        });

        let iframeFieldsContent = iframe.querySelectorAll('[class="ui-entity-editor-content-block"]');
        iframeFieldsContent.forEach((node) => {
            node.style.width = dC_IframeContent_width;
        });

        let iframeFieldsAdress = iframe.querySelectorAll('[class="crm-address-control-item"]');
        iframeFieldsAdress.forEach((node) => {
            node.style.clear = "both";
            node.style.textOverflow = "ellipsis";
            node.style.overflow = "hidden";
            node.style.whiteSpace = "nowrap";
            node.style.height = "61px";
        });
        let iframeFieldsAdressText = iframe.getElementsByClassName("ui-link");
        iframeFieldsAdressText = Array.from(iframeFieldsAdressText);
        iframeFieldsAdressText.forEach((node) => {
            node.style.font = "9px/12px var(--ui-font-family-primary,var(--ui-font-family-helvetica))";
        });
    }
    //Настройка блока "отображение логов в потоке карточки сделки"
    const dc_IfameFlowDeleteList = [
        '[title="Задача просрочена"]',
        '[title="Создана задача"]',
        '[title="Создана задача"]',
        '[title="Напоминание о деле"]',
        '[title="Создана задача"]',
        '[title="Создана сделка"]',
        '[title="Создано дело"]',
        '[title="Задача просмотрена"]',
        '[title="В задаче изменен крайний срок"]',
    ];
    async function dc_IfameFlowDelete() {
        let iframe = document //.getElementsByTagName("iframe")[0].contentWindow.document;
        dc_IfameFlowDeleteList.forEach((node) => {
            let selectAtivity = iframe.querySelectorAll(node);
            selectAtivity.forEach((node) => {
                node.parentNode.parentNode.parentNode.parentNode.remove();
            });
        });
    }

    const dc_IfameFlowLinkDeleteList = ["Бизнес-процессы", "Элемент успешно завершен"];
    async function dc_IfameFlowLinkDelete() {
        let iframe = document //.getElementsByTagName("iframe")[0].contentWindow.document;
        let selectAtivity = iframe.querySelectorAll('[class="crm-entity-stream-content-event-title"]');
        selectAtivity.forEach((node) => {
            let nodetext = node.textContent;
            dc_IfameFlowLinkDeleteList.forEach((titleToRemove) => {
                if ((nodetext = titleToRemove)) {
                    node.parentNode.parentNode.parentNode.parentNode.remove();
                }
            });
        });
    }

    //Настройка блока "Отображение активити в потоке"
    async function dc_IframeFlowActiv() {
        let iframe = document //.getElementsByTagName("iframe")[0].contentWindow.document;

        let userIcon = iframe.getElementsByClassName("crm-timeline__card-top_user")
        userIcon = Array.from(userIcon)
        userIcon.forEach((node) => {
            node.style.margin = '0px 0px 0px 7px'
        });

        let logCard = iframe.getElementsByClassName("--log-message")
        logCard = Array.from(logCard)
        logCard.forEach((node) => {
            node.style.flexDirection = 'initial'
            node.style.alignItems = 'center'
            node.style.padding = '4px'
            node.style.border = '0'
        })

        let logContent = iframe.getElementsByClassName("crm-entity-stream-content-detail-info")
        logContent = Array.from(logContent)
        logContent.forEach((node) => {
            node.style.width = '600px'
        });

        let buttonBottom = iframe.getElementsByClassName("crm-timeline__card-action_buttons")
        buttonBottom = Array.from(buttonBottom)
        buttonBottom.forEach((node) => {
            node.remove()
        });
        
        let cardLogo = iframe.getElementsByClassName("crm-timeline__card-logo_container")
        cardLogo = Array.from(cardLogo)
        cardLogo.forEach((node) => {
            node.style.margin = '-8px -4px -5px -14px'
            node.style.scale = '74%'
        });

        let cardSize = iframe.getElementsByClassName("crm-timeline__card-container")
        cardSize = Array.from(cardSize)
        cardSize.forEach((node) => {
            node.style.padding = '0px 0'
        });

        let audioPlayer = iframe.getElementsByClassName("crm-timeline__audioplayer-contianer")
        audioPlayer = Array.from(audioPlayer)
        audioPlayer.forEach((node) => {
            node.style.margin = '-13px 0px -17px 0px'
        });

        let noteMenu = iframe.getElementsByClassName("crm-timeline__card-action_menu")
        noteMenu = Array.from(noteMenu)
        noteMenu.forEach((node) => {
            node.style.margin = '90px 0px 0px -5px'
            node.style.scale = '80%'
        });

        let actionMenu = iframe.getElementsByClassName("crm-timeline__card-action")
        actionMenu = Array.from(actionMenu)
        actionMenu.forEach((node) => {
            node.style.position = 'absolute'
            node.style.alignItems = 'start'
            node.style.margin = '0px'
        });

        let doneCheckBox = iframe.getElementsByClassName("crm-timeline__card-top_controller")
        doneCheckBox = Array.from(doneCheckBox)
        doneCheckBox.forEach((node) => {
            node.style.zIndex = '70'
        });


    }
    dc_IframeFlowActiv()


    // Область конфигуации запуска
    const pagePath = window.location.pathname;
    //Запуск скрипта канбана
    if (pagePath.includes("/crm/deal/kanban/category/")) {
        setTimeout(() => {
            //TODO добавить нормальный запуск
            MainKanban();
        }, loadingTime);

        self.addEventListener("DOMNodeInserted", () => {
            //TODO поменять на MutationObserver
            dC_FieldKanban();
            dC_Kanban();
        });
    }

    //Запуск скрипта карточки сделки
    const mutConfig = {
        attributes: false,
        childList: true,
        subtree: true, // в этом была проблема
    };

    if (pagePath.includes("crm/deal/details/")) {
        console.log("This is Deal Page");
        setTimeout(() => {
            //dC_IframeFields();
            dc_IfameFlowDelete();
            dc_IfameFlowLinkDelete();
            dc_IframeFlowActiv();
            function dcObserverCallback(mutation) {
                mutation.forEach(function (mutation) {
                    //dC_IframeFields();
                    dc_IfameFlowDelete();
                    dc_IfameFlowLinkDelete();
                    dc_IframeFlowActiv();
                });
            }

            let iframeDoc = document //.getElementsByTagName("iframe")[0].contentWindow.document;
            let dcObserver = new MutationObserver(dcObserverCallback);
            dcObserver.observe(iframeDoc, mutConfig);
        }, loadingTime); //TODO добавить нормальный запуск
    } else {
        console.log("BitrixUI: This not Deal page");
    }
} else {
    console.log("BitrixUI: Wrong Portal");
}

//Описать
//TODO
// $(document).ajaxComplete(function () {
//   dC_FieldKanban();
//   dC_Kanban();
// });

// self.addEventListener('DOMSubtreeModified', () => {
//     dC_FieldKanban();
//     dC_Kanban();
//   });
