// ==UserScript==
// @name         Подсветка поля "Наименование учреждения" при его пустом значении на сайте HSPM.
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Меняет рамку контейнера для поля с "references/model[@id='contact.name']/instance/hpc.dept.name" на красную, если значение пустое.
// @author       Reqwiem Никита
// @match        https://sm.mos.ru/sm/index.do*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530459/%D0%9F%D0%BE%D0%B4%D1%81%D0%B2%D0%B5%D1%82%D0%BA%D0%B0%20%D0%BF%D0%BE%D0%BB%D1%8F%20%22%D0%9D%D0%B0%D0%B8%D0%BC%D0%B5%D0%BD%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5%20%D1%83%D1%87%D1%80%D0%B5%D0%B6%D0%B4%D0%B5%D0%BD%D0%B8%D1%8F%22%20%D0%BF%D1%80%D0%B8%20%D0%B5%D0%B3%D0%BE%20%D0%BF%D1%83%D1%81%D1%82%D0%BE%D0%BC%20%D0%B7%D0%BD%D0%B0%D1%87%D0%B5%D0%BD%D0%B8%D0%B8%20%D0%BD%D0%B0%20%D1%81%D0%B0%D0%B9%D1%82%D0%B5%20HSPM.user.js
// @updateURL https://update.greasyfork.org/scripts/530459/%D0%9F%D0%BE%D0%B4%D1%81%D0%B2%D0%B5%D1%82%D0%BA%D0%B0%20%D0%BF%D0%BE%D0%BB%D1%8F%20%22%D0%9D%D0%B0%D0%B8%D0%BC%D0%B5%D0%BD%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5%20%D1%83%D1%87%D1%80%D0%B5%D0%B6%D0%B4%D0%B5%D0%BD%D0%B8%D1%8F%22%20%D0%BF%D1%80%D0%B8%20%D0%B5%D0%B3%D0%BE%20%D0%BF%D1%83%D1%81%D1%82%D0%BE%D0%BC%20%D0%B7%D0%BD%D0%B0%D1%87%D0%B5%D0%BD%D0%B8%D0%B8%20%D0%BD%D0%B0%20%D1%81%D0%B0%D0%B9%D1%82%D0%B5%20HSPM.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const targetAlias = "references/model[@id='contact.name']/instance/hpc.dept.name";
    const CHECK_INTERVAL = 1000;

    const redBorder = '2px solid red';
    const redBoxShadow = '0 0 8px 2px rgba(255,0,0,0.7)';
    const transition = 'box-shadow 0.3s ease, border 0.3s ease';

    function highlightContainer(input, isEmpty) {
        const container = input.closest('.mandatoryFieldStyle');
        if (container) {
            container.style.transition = transition;
            container.style.border = isEmpty ? redBorder : '';
            container.style.boxShadow = isEmpty ? redBoxShadow : '';
        } else {
            // fallback — если контейнера нет
            input.style.transition = transition;
            input.style.border = isEmpty ? redBorder : '';
            input.style.boxShadow = isEmpty ? redBoxShadow : '';
        }
    }

    function processDoc(doc) {
        if (!doc) return;
        const inputs = doc.querySelectorAll(`input[alias="${targetAlias}"]`);
        inputs.forEach(input => {
            const isEmpty = input.value.trim() === "";
            highlightContainer(input, isEmpty);
        });
    }

    function processFrames() {
        processDoc(document);
        const iframes = document.querySelectorAll("iframe");
        iframes.forEach(frame => {
            try {
                const frameDoc = frame.contentDocument || frame.contentWindow.document;
                processDoc(frameDoc);
            } catch (e) {
                console.error("Ошибка доступа к содержимому iframe:", e);
            }
        });
    }

    setInterval(processFrames, CHECK_INTERVAL);

    const observer = new MutationObserver(() => {
        processFrames();
    });
    observer.observe(document.body, { childList: true, subtree: true, attributes: true });

    function observeIframes() {
        const iframes = document.querySelectorAll("iframe");
        iframes.forEach(frame => {
            frame.addEventListener('load', () => {
                try {
                    const frameDoc = frame.contentDocument || frame.contentWindow.document;
                    processDoc(frameDoc);
                    if (frameDoc && frameDoc.body) {
                        const observerFrame = new MutationObserver(() => {
                            processDoc(frameDoc);
                        });
                        observerFrame.observe(frameDoc.body, { childList: true, subtree: true, attributes: true });
                    }
                } catch (e) {
                    console.error("Ошибка доступа к iframe после загрузки:", e);
                }
            });
        });
    }
    setInterval(observeIframes, 2000);
})();

