// ==UserScript==
// @name         Telegram-Conversations
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Телеграм Вид аддон гaндон я eбу ваще
// @author       я
// @match        https://lolz.live/conversations/*
// @match        https://lolz.guru/conversations/*
// @match        https://zelenka.guru/conversations/*
// @match        https://lzt.market/conversations/
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/505899/Telegram-Conversations.user.js
// @updateURL https://update.greasyfork.org/scripts/505899/Telegram-Conversations.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
.ImDialogHeader{
background: #282e33;
}


.conversationViewContainer {
    background: #18191d; /* Изменено на background */
}
        /* Общие стили */
        body {
            background-color: #08080a; /* Цвет фона страницы */
            color: #e4ecf2; /* Цвет текста */
        }
        .conversationContainer{

        border-radius: unset;

        }
        /* Расширяем высоту и ширину div с диалогами и центрируем его */
        #Conversations.conversationContainer {
            border-radius: unset;
            height: 85vh; /* Устанавливаем высоту на 80% от высоты видимого экрана */
            width: 100vw; /* Устанавливаем ширину на 80% от ширины видимого экрана */
            max-height: 90vh; /* Необязательно: устанавливаем максимальную высоту на 90% от высоты видимого экрана */
            max-width: 90vw; /* Необязательно: устанавливаем максимальную ширину на 90% от ширины видимого экрана */
            position: fixed; /* Используем фиксированное позиционирование для сохранения позиции на экране */
            top: 50%; /* Центрируем по вертикали */
            left: 50%; /* Центрируем по горизонтали */
            transform: translate(-50%, -50%); /* Смещаем по горизонтали и вертикали, чтобы центрировать по середине экрана */
            overflow: hidden; /* Прячем переполнение, если оно возникает */
            box-sizing: border-box; /* Учитываем padding и border в общей ширине и высоте */
            z-index: 1000; /* Обеспечиваем, чтобы контейнер был выше других элементов */
        }

        /* Стили для списка диалогов */
        .conversationItem {
            background-color: #282e33; /* Цвет фона для диалогов */
            border-radius: 3px; /* Закругленные углы для более похожего на Telegram вида */
            
            align-items: center;
            padding: 10px; /* Добавляем отступы для лучшего расстояния */
            transition: background-color 0.3s ease;
            
            overflow: hidden; /* Предотвращаем переполнение содержимого */
        }

        .conversationItem:hover {
            background-color: #446d97; /* Цвет фона при наведении на диалог */
        }
       .conversationItem.active, .conversationSearch--Recipient.active{

         background-color: #3b5e83; /* Цвет фона при наведении на диалог */

       }

        .listBlock {
            flex: 1;
            overflow: hidden; /* Предотвращаем переполнение содержимого */
        }

        .listBlock .title {    
            justify-content: center;
        }

/* Изменяем цвет галочек (иконок) */
.listBlock .title .messageStateIcon  {
    color: #179CDE; /* Цвет галочек, как в Telegram */
}

.chat2-button.lztng-12iv6pu{

background: #179cde;

}

.conversationItem .avatar.isOnline::before{

background: #179cde;

}

         /* тг ответить юзеру*/

        .bbCodeBlock.bbCodeQuote {
            background-color: #2a2f33;
            border-left: 3px solid #5084b9;
            padding: 10px;
            border-radius: 10px;
            margin: 10px 0;

            box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15); /* Тень вокруг блока */
        }

        .bbCodeBlock.bbCodeQuote .quoteContainer {
            padding-left: 10px;
        }

        .bbCodeBlock.bbCodeQuote .quoteAuthor {
            color: #5084b9;
            font-weight: bold;
            text-decoration: none;
        }

        .bbCodeBlock.bbCodeQuote .quote {
            color: #fff;
        }

        .bbCodeBlock.bbCodeQuote .quoteExpand {
            color: #5084b9;
            font-weight: bold;
            cursor: pointer;
            margin-top: 10px;
        }

        .bbCodeBlock.bbCodeQuote .quoteExpand:hover {
            text-decoration: underline;
        }
      .universalSearchForm .universalSearchInput, .conversationList--bottomBar, .simpleRedactor{
      background: #22262b;
      }

      .fr-box.fr-basic .fr-wrapper, .fr-toolbar.fr-top{
      background: #282e33;
      }
      .message.unread .messageWrapper{
      background: #282a31;
      }

      .conservationPinnedMessage {

    border-top: 1px solid rgb(5 5 5);

    }

    .button, .button_header{

    background: #313b43;

    }
    .conservationPinnedMessageTextTitle{
    color: #64b9f7;
    }

    .conversationControl--icon, .universalSearchForm:before {
    color: #179CDE;
    }

    .conversationMessages .messageText img:not(.mceSmilie){
    border-radius: 4px;
    }

    #ConversationMessageList .message.Selected, .conversationItem.unread{
      background: #313b43;
    }
    .button_header:hover{
    background: rgb(62,76,91);
    }

    .MessageManagePanel .button{
    background: #1284bd;
    }
    .MessageManagePanel .button:hover{
    background: #159add;
    }
    .unfurl_thread-add-block{
    background: #2a2f33;
    }

.conversationList--bottomBar--Mode.button.ModChanger.ShowAll {
            display: none !important;
        }

    .starredConversationIcon{
    color: #179CDE;
    margin: 4px 4px 0px;
    }

    .imDialog .hasChangedContactsWarning{
    background: #2a2f33;
    }
    .systemMessageWrapper .systemMessage{
    background: #2a2f33;
    }


    .conversationListFolder{
    background: #23282d;
    }
    .conversationFolder.active-folder{
    background: #1e2227;
    }

    .conversationFolder:hover:not(.active-folder):hover{
    background: #1e2227;
    }

    .message.unread:not(.Selected) .messageWrapper {

    background:  #23262b;

    }




.conversationFolder.active-folder.all .conversationFolder-icon {
    background-image: url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M1.26317 16.5C1.26317 12.9331 4.09172 10 7.63159 10C11.1715 10 14 12.9331 14 16.5C14 20.0669 11.1715 23 7.63159 23C6.90394 23 6.20298 22.875 5.54947 22.6444C5.44146 22.6063 5.37446 22.5827 5.32533 22.5664C5.31641 22.5635 5.30911 22.5611 5.30327 22.5593L5.29784 22.5599C5.26354 22.5637 5.21679 22.57 5.13013 22.5818L2.13533 22.9908C1.81127 23.0351 1.48606 22.9181 1.26448 22.6775C1.0429 22.4369 0.952961 22.1032 1.02365 21.7839L1.63499 19.0222C1.65624 18.9262 1.6676 18.8744 1.67491 18.8363C1.67532 18.8342 1.67604 18.8303 1.67604 18.8303C1.67423 18.824 1.67193 18.8162 1.66905 18.8066C1.65258 18.7521 1.62837 18.6778 1.589 18.5573C1.37731 17.9093 1.26317 17.2171 1.26317 16.5Z' fill='%23179cde'/%3E%3Cpath d='M5.14754 8.3726C5.92512 8.13071 6.75395 8 7.61788 8C12.3313 8 16.0001 11.8907 16.0001 16.5C16.0001 17.3136 15.8858 18.1049 15.6716 18.8563C16.2136 18.759 16.7393 18.6136 17.2438 18.4246C17.315 18.3979 17.386 18.3707 17.4579 18.3461C17.5159 18.3528 17.5737 18.3619 17.6315 18.3703L20.8444 18.8413C20.9961 18.8636 21.1682 18.8889 21.3182 18.8974C21.4843 18.9069 21.7426 18.9058 22.0162 18.7882C22.3579 18.6412 22.6328 18.3726 22.7876 18.0343C22.9115 17.7635 22.9185 17.5054 22.9129 17.3391C22.9078 17.1888 22.8865 17.0162 22.8677 16.864L22.4617 13.5661C22.4512 13.4804 22.4457 13.4354 22.4425 13.4024C22.4601 13.3301 22.4931 13.2602 22.5195 13.1909C22.8983 12.1979 23.1053 11.1219 23.1053 10C23.1053 5.02326 19.0461 1 14.0526 1C9.61686 1 5.9183 4.17483 5.14754 8.3726Z' fill='%23179cde'/%3E%3C/svg%3E");
    transition: 0.6s;
}

.mainc {

color: #179cde;

}

.bbCodeBlock--unfurl{

background: #1f2227 !important;


}

.emCtrl, .messageText a:not(.button):not(.username){

color: #179cde;

}

.bbCodeBlock--unfurl {

border-left: 2px solid #5084b9 !important;

}

.conversationMessages .message .bbCodeQuote {
    margin: 15px 0 10px;
    border-radius: 6px;
    background: #228e5d url(https://nztcdn.com/files/9a84e348-30a3-41b0-8d6c-00b4efc507ee.svg) no-repeat left center;
    background: rgb(30 34 39 / 100%) url(https://nztcdn.com/files/9a84e348-30a3-41b0-8d6c-00b4efc507ee.svg) no-repeat left center;
    background-size: auto 100%;
    background-position: right center;
}

.conversationFolder.active-folder .conversationFolder-title {
    color: #179cde;
    transition: 0.6s;
}

.Disable {

    fill: rgb(148, 148, 148);

}

.conversationFolder.active-folder.unread .conversationFolder-icon {
    background-image: url("data:image/svg+xml,<svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'><path fill-rule='evenodd' clip-rule='evenodd' d='M16.2414 2H7.7588C6.95383 1.99999 6.28946 1.99998 5.74827 2.04419C5.18617 2.09012 4.66947 2.18868 4.18413 2.43598C3.43149 2.81947 2.81956 3.43139 2.43607 4.18404C2.18878 4.66937 2.09022 5.18608 2.04429 5.74818C2.00007 6.28937 2.00008 6.95373 2.0001 7.7587L2.00005 14.1376C1.99962 14.933 1.9993 15.5236 2.13639 16.0353C2.50626 17.4156 3.58445 18.4938 4.96482 18.8637C5.27229 18.9461 5.60829 18.9789 6.0001 18.9918L6.00009 20.371C6.00005 20.6062 6 20.846 6.01785 21.0425C6.03492 21.2305 6.08012 21.5852 6.32778 21.8955C6.61276 22.2525 7.0449 22.4602 7.50172 22.4597C7.8987 22.4593 8.20394 22.273 8.36137 22.1689C8.52597 22.06 8.7132 21.9102 8.89688 21.7632L11.31 19.8327C11.8286 19.4178 11.9826 19.3007 12.1425 19.219C12.303 19.137 12.4738 19.0771 12.6504 19.0408C12.8263 19.0047 13.0197 19 13.6838 19H16.2414C17.0464 19 17.7107 19 18.2519 18.9558C18.814 18.9099 19.3307 18.8113 19.8161 18.564C20.5687 18.1805 21.1806 17.5686 21.5641 16.816C21.8114 16.3306 21.91 15.8139 21.9559 15.2518C22.0001 14.7106 22.0001 14.0463 22.0001 13.2413V7.75868C22.0001 6.95372 22.0001 6.28936 21.9559 5.74818C21.91 5.18608 21.8114 4.66937 21.5641 4.18404C21.1806 3.43139 20.5687 2.81947 19.8161 2.43598C19.3307 2.18868 18.814 2.09012 18.2519 2.04419C17.7107 1.99998 17.0464 1.99999 16.2414 2ZM12 6.5C12.5523 6.5 13 6.94772 13 7.5V9.5H15C15.5523 9.5 16 9.94772 16 10.5C16 11.0523 15.5523 11.5 15 11.5H13V13.5C13 14.0523 12.5523 14.5 12 14.5C11.4477 14.5 11 14.0523 11 13.5V11.5H9C8.44772 11.5 8 11.0523 8 10.5C8 9.94772 8.44772 9.5 9 9.5H11V7.5C11 6.94772 11.4477 6.5 12 6.5Z' fill='%23179cde'/></svg>");
!important }

.socket-connected.lztng-3a9wur {
    background: #179cde; !important
}

.conversationListFolder, .conversationList .universalSearchForm, .conversationListFolder-container {

background: #191d21;

}

.conversationFolder{

background: #22272b;

}


        /* Конец стилей */
    `);
})();

(function () {
    'use strict';

    const changeColor = () => {
        const container = document.getElementById('SoundNotificationSwitcher');
        if (!container) return;

        container.querySelectorAll('svg').forEach(svg => {
            svg.setAttribute('fill', '#179cde');
        });
    };

    // Подождать загрузки DOM
    const observer = new MutationObserver(() => changeColor());
    observer.observe(document.body, { childList: true, subtree: true });

    window.addEventListener('load', changeColor);
})();






