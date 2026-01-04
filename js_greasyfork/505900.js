// ==UserScript==
// @name         NO Telegram-Conversations
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Телеграм Вид аддон гaндон я eбу ваще
// @author       я
// @match        https://lolz.live/conversations/*
// @match        https://lolz.guru/conversations/*
// @match        https://zelenka.guru/conversations/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/505900/NO%20Telegram-Conversations.user.js
// @updateURL https://update.greasyfork.org/scripts/505900/NO%20Telegram-Conversations.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
.ImDialogHeader{

}

.conversationViewContainer {
   
}
        /* Общие стили */
        body {
         
        }

        /* Расширяем высоту и ширину div с диалогами и центрируем его */
        #Conversations.conversationContainer {
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
          
            border: 1px solid #1c1f23;
            border-radius: 3px; /* Закругленные углы для более похожего на Telegram вида */

            align-items: center;
            padding: 10px; /* Добавляем отступы для лучшего расстояния */
           
            overflow: hidden; /* Предотвращаем переполнение содержимого */
        }

        .conversationItem:hover {
          
        }
       .conversationItem.active, .conversationSearch--Recipient.active{

       

       }

        .listBlock {
            flex: 1;
            overflow: hidden; /* Предотвращаем переполнение содержимого */
        }

        .listBlock .title {
            justify-content: center;
        }

/* Изменяем цвет галочек (иконок) */
.listBlock .title .messageStateIcon {
  
}

         /* тг ответить юзеру*/

        .bbCodeBlock.bbCodeQuote {
     
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
           
            font-weight: bold;
            text-decoration: none;
        }

        .bbCodeBlock.bbCodeQuote .quote {
          
        }

        .bbCodeBlock.bbCodeQuote .quoteExpand {
          
            font-weight: bold;
            cursor: pointer;
            margin-top: 10px;
        }

        .bbCodeBlock.bbCodeQuote .quoteExpand:hover {
            text-decoration: underline;
        }
      .universalSearchForm .universalSearchInput, .conversationList--bottomBar, .simpleRedactor{
   
      }

      .fr-box.fr-basic .fr-wrapper, .fr-toolbar.fr-top{
    
      }
      .message.unread .messageWrapper{
   
      }

      .conservationPinnedMessage {

    border-top: 1px solid rgb(5 5 5);

    }

    .button, .button_header{

   

    }
    .conservationPinnedMessageTextTitle{

    }

    .conversationControl--icon, .universalSearchForm:before {
 
    }

    .conversationMessages .messageText img:not(.mceSmilie){
    border-radius: 4px;
    }

        /* Конец стилей */
    `);
})();
