// ==UserScript==
// @name            ⚙️HotPot.ai Restyled
// @namespace       Wizzergod
// @version         1.0.10
// @description     Add new button to scroll up/bottom, and change page style to dark purple.
// @description:ru  Добавляет кнопку для авто-прокрутки и изменения текста в зависимости от положения страницы, с изменением фона на темно фиолетовый.
// @icon            https://www.google.com/s2/favicons?sz=64&domain=hotpot.ai
// @license         MIT
// @author          Wizzergod
// @match           *://hotpot.ai/*
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/488929/%E2%9A%99%EF%B8%8FHotPotai%20Restyled.user.js
// @updateURL https://update.greasyfork.org/scripts/488929/%E2%9A%99%EF%B8%8FHotPotai%20Restyled.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Создаем стиль для изменения фона
var customStyle = document.createElement('style');
customStyle.textContent = `
  body {
    background: #2a233a;
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    color: #fff;
    font-color: #fff;
    background-color: #2a233a;
  }
  textarea, input, #rootBox, #rootOverlay, .centered, .overlay {
    color: #fff;
    font-color: #fff;
    background-color: #202020;
  }
  , h2.templates, .description, .tagline, .categoryName, h2.categoryName, .categoryName.h2, h2, p
  {
    color: #fff;
  }

  #mainBox{
    background: unset !important;
    color: #fff;
  }

  #controlBox {
    width: inherit !important;
    padding: 10px !important;
  }
  #controlBox .option.horizontal {
    margin-top: unset !important;
  }
  #controlBox .styleBox .thumbnailBox.selected {
    border-color: #9aff00 !important;
    border-width: 4px !important;
  }
#resultListBox .resultBox {
    width: 512px !important;
    height: 512px !important;
  }
#resultListBox .imageBox {
    width: 512px !important;
    height: 512px !important;
  }
#controlBox .styleBox .headerBox {
    padding-top: 20px !important;
  }
#resultListBox {
    display: flex;
    flex-wrap: wrap;
}

.upgradeBox {
    display: none !important;
}
article:nth-of-type(7) {
    display: none !important;
}
#resultListBox .linkBox {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
}
#resultListBox .resultBox .statusBox {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
}

#controlBox .styleBox .historyBox {
    display: flex !important;
    width: 524px;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: center;
    align-content: flex-start;
}

#controlBox .styleBox .thumbnailBox {
    padding: 0;
  }

[id^="bsa-zone_"] @media{
    width: auto;
    min-height: auto;
    min-width: auto;
}

  #pageBox {
    max-width: unset !important;
    padding: 0px 0px 0px 70px;
  }

//body, p, ol, ul, td, input, select, textarea {color: #fff;}

`;

    // Переопределяем стиль для элемента с идентификатором sidebarBox
    var sidebarBox = document.getElementById('sidebarBox');
    if (sidebarBox) {
        sidebarBox.style.width = 'auto'; // Или любое другое значение, которое вы хотите использовать
    }

    // Добавляем стиль на страницу
    document.head.appendChild(customStyle);

    // Создаем кнопку прокрутки
    var scrollToDownloadButton = document.createElement('div');
    scrollToDownloadButton.style.position = 'fixed';
    scrollToDownloadButton.style.bottom = '10px';
    scrollToDownloadButton.style.right = '10px';
    scrollToDownloadButton.style.padding = '10px';
    scrollToDownloadButton.style.background = 'rgba(0, 0, 0, 0.7)';
    scrollToDownloadButton.style.color = 'white';
    scrollToDownloadButton.style.borderRadius = '10px';
    scrollToDownloadButton.style.zIndex = '9999';
    scrollToDownloadButton.style.cursor = 'pointer';
    scrollToDownloadButton.style.fontSize = '150%';
    // Функция для проверки положения страницы
    function checkScrollPosition() {
        if (window.scrollY > 0) {
            scrollToDownloadButton.textContent = '🔼';
        } else {
            scrollToDownloadButton.textContent = '🔽';
        }
    }

// Обработчик клика для прокрутки в начало или в конец страницы
scrollToDownloadButton.addEventListener('click', function() {
    var currentPosition = window.scrollY || window.pageYOffset;

    if (currentPosition === 0) {
        // Если текущая позиция уже в начале страницы, прокрутить в конец
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    } else {
        // В противном случае, прокрутить в начало
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});

    // Добавляем кнопку на страницу
    document.body.appendChild(scrollToDownloadButton);

    // Добавляем обработчик прокрутки для автоматического изменения текста кнопки
    window.addEventListener('scroll', checkScrollPosition);

    // Вызываем функцию для установки начального текста кнопки
    checkScrollPosition();

})();