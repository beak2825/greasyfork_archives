// ==UserScript==
// @name         Frisbuy-debugger
// @namespace    http://tampermonkey.net/
// @version      1.0.8
// @description  Плагин для удобной работы с frisbuy виджетами
// @author       You
// @match        *://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/528996/Frisbuy-debugger.user.js
// @updateURL https://update.greasyfork.org/scripts/528996/Frisbuy-debugger.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Константы
    const GALLERY_TYPE = 'gallery';
    const STORY_TYPE = 'story';
    const IU_TYPE = 'IU';
    const STL_TYPE = 'stl';
    const MARKETPLACE_REVIEW_TYPE = 'marketplace';
    const OUTFIT_TYPE = 'outfitOnModel';
    const MAX_CHECKS = 10;
    const COUNT_OF_BETAS = 3;

    const widgetInstances = {
        [GALLERY_TYPE]: {
            prefix: 'fb/widget'
        },
        [STORY_TYPE]: {
            prefix: 'embed/stories'
        },
        [IU_TYPE]: {
            prefix: 'embed/imageupload'
        },
        [MARKETPLACE_REVIEW_TYPE]: {
            prefix: 'fb/widget'
        },
        [OUTFIT_TYPE]: {
            prefix: 'fb/outfit-on-model'
        },
        [STL_TYPE]: {
            prefix: 'fb/widget'
        }
    }

    // Инициализация
    const head = document.head || document.getElementsByTagName('head')[0];
    const wrapper = document.createElement("div")
    wrapper.classList.add('frisbuy-debug-wrapper', 'frisbuy-debug-wrapper--closed');

    // Глобальные переменные
    let widgets = [];

    function toggleOpen() {
        if(!wrapper.classList.contains('frisbuy-debug-wrapper--closed')) {
            wrapper.classList.add('frisbuy-debug-wrapper--closed');
        } else {
            wrapper.classList.remove('frisbuy-debug-wrapper--closed');
        }
    }

    function init() {
        // Создаем основной блок со стилями
        const styleTag = document.createElement("style");
        styleTag.type = "text/css";
        const css = `
        .frisbuy-debug-wrapper {
          position: fixed;
          top: 95%;
          left: 0;
          transform: translate(0, -100%);
          z-index: 99999999999999;

          font-family: sans-serif;
          line-height: 1;
          font-size: 14px;

          background-color: #fff;
          border: 2px #000 solid;
          border-left: 0;
          border-radius: 0 4px 4px 0;
          color: #000;
          padding: 8px;

          transition: all 0.3s ease-out;
        }

        .frisbuy-debug-wrapper--closed {
         transform: translate(-100%, -100%);
        }

        .frisbuy-debug-wrapper__title {
          display: flex;
          align-items: center;
          gap: 4px;
          padding-bottom: 8px;
          margin-bottom: 8px;
          border-bottom: 1px #000 solid;
          font-size: 14px;
        }

        .frisbuy-debug-wrapper__type-title {
          display: flex;
          gap: 4px;

          color: #000;
          font-size: 10px;
        }

        .frisbuy-debug-wrapper__widgets-list {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .frisbuy-debug-wrapper__widget {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .frisbuy-debug-wrapper__widget-links-list {
          display: flex;
          gap: 6px;
        }

        .frisbuy-debug-wrapper__copy-button {
         color: blue;
         cursor: pointer;
        }

        .frisbuy-debug-wrapper__link-button {
          color: green;
        }

        .frisbuy-debug-wrapper__reload-button {
          font-size: 10px;
          line-height: 12px;
          color: red;
          cursor: pointer;
        }

        .frisbuy-debug-wrapper__toggle {
          position: absolute;
          width: 20px;
          height: 20px;
          background-color: white;
          top: 50%;
          left: 100%;
          transform: translateY(-50%);
          text-align: center;
          line-height: 20px;
          border: 1px #000 solid;
          border-left: 0;
          border-radius: 0 50% 50% 0;
          color: gray;
          cursor: pointer;
        }
      `

        // Добавляем заголовок в контейнер
        const title = document.createElement("div");
        title.classList.add('frisbuy-debug-wrapper__title');
        title.innerText = "FWidgets";
        // Добавляем обновление в заголовок
        const reloadButton = document.createElement("div");
        reloadButton.classList.add('frisbuy-debug-wrapper__reload-button');
        reloadButton.innerText = "Reload";
        reloadButton.addEventListener("click", widgetsCutch)

        title.appendChild(reloadButton);
        wrapper.appendChild(title);


        // Добавляем кнопку открытия/закрытия
        const toggle = document.createElement("div");
        toggle.classList.add('frisbuy-debug-wrapper__toggle');
        toggle.innerText = ">";
        toggle.addEventListener("click", toggleOpen)

        wrapper.appendChild(toggle);



        // Добавляем наш виджет на страницу
        head.appendChild(styleTag);
        document.body.appendChild(wrapper);
        // Добавляем стили на страницу
        if (styleTag.styleSheet){
            // This is required for IE8 and below.
            styleTag.styleSheet.cssText = css;
        } else {
            styleTag.appendChild(document.createTextNode(css));
        }
    }

    function fallbackCopyTextToClipboard(text) {
        var textArea = document.createElement("textarea");
        textArea.value = text;

        // Avoid scrolling to bottom
        textArea.style.top = "0";
        textArea.style.left = "0";
        textArea.style.position = "fixed";

        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            var successful = document.execCommand('copy');
            var msg = successful ? 'successful' : 'unsuccessful';
            console.log('Fallback: Copying text command was ' + msg);
        } catch (err) {
            console.error('Fallback: Oops, unable to copy', err);
        }

        document.body.removeChild(textArea);
    }

    function copyTextToClipboard(event) {
        if (!navigator.clipboard) {
            fallbackCopyTextToClipboard(event.currentTarget.embedId);
            return;
        }
        navigator.clipboard.writeText(event.currentTarget.embedId).then(function() {
            console.log('Async: Copying to clipboard was successful!');
        }, function(err) {
            console.error('Async: Could not copy text: ', err);
        });
    }

    function showWidgets() {
        // Очищаем уже добавленные
        [...document.querySelectorAll('.frisbuy-debug-wrapper__copy-button')].map(element => {
            element.removeEventListener("click", copyTextToClipboard);
        });
        document.querySelectorAll(".frisbuy-debug-wrapper__widgets-list").forEach(el => el.remove());

        // Добавляем в список виджеты
        const widgetsContainer = document.createElement('div');
        widgetsContainer.classList.add('frisbuy-debug-wrapper__widgets-list');

        widgets.map(instance => {
            const widgetContainer = document.createElement('div');
            widgetContainer.classList.add('frisbuy-debug-wrapper__widget');

            const linksContainer = document.createElement('div');
            linksContainer.classList.add('frisbuy-debug-wrapper__widget-links-list');

            // type
            const typeTitle = document.createElement('div');
            typeTitle.classList.add('frisbuy-debug-wrapper__type-title');
            typeTitle.innerText = instance.type;
            // embedId copy
            const copyButton = document.createElement('span');
            copyButton.classList.add('frisbuy-debug-wrapper__copy-button');
            copyButton.innerText = 'Copy EmbedId';
            typeTitle.appendChild(copyButton)
            copyButton.addEventListener("click", copyTextToClipboard);
            copyButton.embedId = instance.widget.settings.embedId;
            // sonata
            const sonataButton = document.createElement('a');
            sonataButton.classList.add('frisbuy-debug-wrapper__link-button');
            sonataButton.href = `https://lk.frisbuy.ru/sonata/admin/app/embedparams/list?filter%5BembedId%5D%5Bvalue%5D=${instance.widget.settings.embedId}`;
            sonataButton.innerText = 'S';
            sonataButton.target = '_blank';
            linksContainer.appendChild(sonataButton);
            // Бой виджетов
            if (widgetInstances[instance.type]) {
                const betaButton = document.createElement('a');
                betaButton.classList.add('frisbuy-debug-wrapper__link-button');
                betaButton.href = `https://widget.frisbuy.ru/${widgetInstances[instance.type].prefix}?embed_id=${instance.widget.settings.embedId}&show=1`;
                if (betaButton.href) {
                    betaButton.innerText = 'wp';
                    betaButton.target = '_blank';
                }
                linksContainer.appendChild(betaButton);
            }
            // betas
            if (widgetInstances[instance.type]) {
                for(let index = 0; index < COUNT_OF_BETAS; index++) {
                    const currentIndex = index > 0 ? index + 1 : '';
                    const betaButton = document.createElement('a');
                    betaButton.classList.add('frisbuy-debug-wrapper__link-button');
                    betaButton.href = `https://beta${currentIndex}.frisbuy.com/${widgetInstances[instance.type].prefix}?embed_id=${instance.widget.settings.embedId}&show=1`;
                    if (betaButton.href) {
                        betaButton.innerText = `b${index + 1}`;
                        betaButton.target = '_blank';
                    }
                    linksContainer.appendChild(betaButton);
                }
            }
            // backoffice(experemental)
            if (instance.type !== IU_TYPE || instance.type !== OUTFIT_TYPE) {
                const backofficeButton = document.createElement('a');
                backofficeButton.classList.add('frisbuy-debug-wrapper__link-button');
                if (instance.type === GALLERY_TYPE) {
                    backofficeButton.href = `https://lk.frisbuy.ru/my/admin/${instance.widget.settings.frisbuyUID}/search/posts#/galleries/g/${instance.widget.settings.embedId}`;
                } else if (instance.type === STORY_TYPE) {
                    backofficeButton.href = `https://lk.frisbuy.ru/my/admin/${instance.widget.settings.frisbuyUID}/search/posts#/galleries/s/${instance.widget.settings.embedId}`;
                }
                if (backofficeButton.href) {
                    backofficeButton.innerText = 'lk';
                    backofficeButton.target = '_blank';
                }
                linksContainer.appendChild(backofficeButton);
            }

            widgetContainer.appendChild(typeTitle);
            widgetContainer.appendChild(linksContainer);

            widgetsContainer.appendChild(widgetContainer);
        })

        wrapper.appendChild(widgetsContainer);
    }

    function widgetsCutch() {
        widgets = [];

        // Собираем все галереи и сторисы/хайлайты в список
        Object.keys(window.frisbuy).map(key => {
            if (typeof window.frisbuy[key].settings !== 'undefined') {
                const isGallery = typeof window.frisbuy[key].settings.gallery !== 'undefined';
                widgets.push({type: isGallery ? GALLERY_TYPE : STORY_TYPE, widget: window.frisbuy[key]});
            }
        })
        // Добавляем IU в список
        if (typeof window.frisbuy.widgets.imageUpload !== 'undefined') {
            widgets.push({type: IU_TYPE, widget: window.frisbuy.widgets.imageUpload});
        }
        // Добавляем marketplaceReview в список
        if (typeof window.frisbuy.widgets.marketplaceReviews !== 'undefined') {
            widgets.push({type: MARKETPLACE_REVIEW_TYPE, widget: window.frisbuy.widgets.marketplaceReviews.data});
        }
        // Добавляем outfit-on-model в список
        if (typeof window.frisbuy.widgets.outfitOnModel !== 'undefined') {
            Object.keys(window.frisbuy.widgets.outfitOnModel).map(key => {
                if (typeof window.frisbuy.widgets.outfitOnModel[key].data?.settings !== 'undefined') {
                    widgets.push({type: OUTFIT_TYPE, widget: window.frisbuy.widgets.outfitOnModel[key].data});
                }
            })
        }
        // Добавляем STL'ы в список
        if (typeof window.frisbuy.widgets.shopTheLook !== 'undefined') {
            Object.keys(window.frisbuy.widgets.shopTheLook).map(key => {
                if (typeof window.frisbuy.widgets.shopTheLook[key].data?.settings !== 'undefined') {
                    widgets.push({type: STL_TYPE, widget: window.frisbuy.widgets.shopTheLook[key].data});
                }
            })
        }

        showWidgets();
    }

    // MAX_CHECKS секунд ждем прогрузки наших виджетов
    function loadChecker() {
        let current = 0;

        const intervalId = setInterval(() => {
            if (current >= MAX_CHECKS) return clearInterval(intervalId);

            if (typeof window.frisbuy !== 'undefined' && typeof window.frisbuy.widgets !== 'undefined') {
                clearInterval(intervalId);
                init();
                widgetsCutch();
            }
            current+=1;
        }, 1000)
        }

    loadChecker();
})();