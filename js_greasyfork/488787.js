// ==UserScript==
// @name         iconicimages.net
// @namespace    iconicimages.net
// @version      2024-03-02.2
// @description  iconicimages.net download
// @author       Anton
// @match        https://iconicimages.net/photo/*
// @grant        none
// @license      MIT
// @run-at document-body
// @downloadURL https://update.greasyfork.org/scripts/488787/iconicimagesnet.user.js
// @updateURL https://update.greasyfork.org/scripts/488787/iconicimagesnet.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function findLastCanvasWithClass(classToFind) {
        if (!document.canvases) {
            console.log('Массив canvases не существует');
            return null;
        }

        for (let i = document.canvases.length - 1; i >= 0; i--) {
            if (document.canvases[i].classList.contains(classToFind)) {
                return document.canvases[i];
            }
        }

        return null;
    }

    var saveImage = function() {
        var filename = "liberated.png";
        var mega = "60000px";
        var container = document.querySelector("smart-frame");
        const canvasWithHyper = findLastCanvasWithClass('hyper-zoom');
        //console.log('HYPER:', canvasWithHyper);
        var hyperWidth = canvasWithHyper.width;
        var hyperHeight = canvasWithHyper.height;
        var originalWidth = parseInt(container.style.getPropertyValue('--sf-original-width'));
        var originalHeight = parseInt(container.style.getPropertyValue('--sf-original-height'));
        console.log('hyperWidth',hyperWidth,'hyperHeight',hyperHeight);
        console.log('originalWidth',originalWidth,'originalHeight',originalHeight);

        if (document.canvases) {
            const canvasWithStage1 = findLastCanvasWithClass('stage');
            console.log("Original STAGE:", canvasWithStage1);
            container.style.width = mega;
            container.style.maxWidth = mega;
            var step2 = (cnvs) => {
                console.log("Downloading STAGE:", cnvs);
                var url = document.createElement("canvas").toDataURL.call(cnvs);
                var a = document.createElement("a");
                a.href = url;
                a.download = filename;
                a.click();
            };
            var check_step2 = () => {
                const canvasWithStage = findLastCanvasWithClass('stage');
                if (canvasWithStage1.width == 0 && !!canvasWithStage && canvasWithStage.width > 0) {
                    step2(canvasWithStage);
                } else {
                    setTimeout(check_step2, 100);
                }
            };
            if (originalWidth > hyperWidth) {
                check_step2();
            } else {
                step2(canvasWithStage1);
            }
        } else {
            console.log("Can't find canvases");
        }
    };

    // Сохраняем оригинальную функцию createElement в переменной
    var originalCreateElement = document.createElement.bind(document);

    // Переопределяем функцию createElement
    document.createElement = function(tagName, options) {
        //console.log('Создан элемент:', tagName, options); // Логируем создание элемента

        // Вызываем оригинальную функцию createElement с теми же аргументами
        var cnvs = originalCreateElement(tagName, options);

        // Вы можете добавить здесь любую дополнительную логику
        if (tagName.toLowerCase() == 'canvas') {
            if (!document.canvases) document.canvases = [];
            document.canvases.push(cnvs);
        }

        return cnvs;
    };


    var addButton = function(frame) {
        // Создаем кнопку
        var button = document.createElement('button');

        // Стилизуем кнопку
        button.style.width = '32px';
        button.style.height = '32px';
        button.style.position = 'absolute';
        button.style.top = '0';
        button.style.left = '0';
        button.style.padding = '0';
        button.style.margin = '0';
        button.style.zIndex = '1000';

        // Добавляем текст или иконку на кнопку
        button.style.background = 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACBUExURXBwcEhISCEhIQsLCzc3NxYWFgkJCQMDAwEBAQAAAHt7ey8vLwICAlJSUhISEj8/PwcHB4eHh319fZKSkv///2hoaMzMzKKiotHR0aenp6ysrF1dXbGxsdbW1iMjI/b29sHBwWNjY0NDQx4eHg4ODikpKZeXl1hYWLe3tzg4OAAAALFS5FEAAAArdFJOU////////////////////////////////////////////////////////wAjyafQAAAACXBIWXMAAA7DAAAOwwHHb6hkAAABNklEQVQ4T4WT2VqEMAyFC4UyZR01gs4IjLvy/g/oSZuBdrzgv0lIDl+bpWoJUEmqdZrEMbHwstwUB2sPhcmzICy2rHRtV2pdlZIQQdMGaaZuG5/xgs5IPMB0LuUE3VGCEUenYEET/H93Lw4wfAoEZSsB8ED0KC5ocVMIquB+PdEgLqgrFigtn8wT0bO4jEZ6ycICbwR1BkEuHw4ITuI68kWprYTz8ELgNJwlgEKUSgrxrR05zYwSsLZIVIr5CJPkaZIAJpdGNYhiy3MdocArwjwEwRFgmucojyPkkpfemZXX+Y0NLunLNETvbFd63zCU6Rv1QfTJdmX0DUOjfKsh+EoCvn1HXatdHTjiFp6qG5Yf94+EN36v444WJkYWJlq5kOvK7S/t/trvP5z9pwd2Hq/j//Nflj+3R0Us6xd/YAAAAABJRU5ErkJggg==")';
        button.style.border = 'none';

        // Добавляем обработчик события клика на кнопку
        button.addEventListener('click', function(event) {
            saveImage();

            // Предотвращаем всплытие события клика, чтобы избежать неожиданного поведения,
            // если есть другие обработчики кликов на родительских элементах
            event.stopPropagation();
        });

        // Убедитесь, что у smart-frame есть относительное, абсолютное или фиксированное позиционирование
        frame.style.position = 'relative';

        // Добавляем кнопку к каждому элементу smart-frame
        frame.appendChild(button);
    };

    var prepareWaiter = function() {
        var frame = document.querySelector('figure');
        if (frame) {
            console.log("Button is HERE");
            addButton(frame);
        } else {
            setTimeout(prepareWaiter, 200);
        }
    };

    console.log('iconicimages.net HELLO');
    prepareWaiter();
})();