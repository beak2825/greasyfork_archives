// ==UserScript==
// @name         ASIWeb Auto Click Button
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Adds a button to asiweb that clicks elements in sequence when enabled
// @author       ils94
// @match        https://asiweb.tre-rn.jus.br/asi/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/538429/ASIWeb%20Auto%20Click%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/538429/ASIWeb%20Auto%20Click%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const clickPaths = [
        "/html/body/div[2]/form/div[3]/div/div/div[1]/ul[2]/li[1]/h3/a",
        "/html/body/div[2]/form/div[3]/div/div/div[1]/ul[2]/li[1]/div/ul[1]/li/div[2]/a",
        "/html/body/div[2]/div[3]/form/div[1]/div[2]/div[2]/p/span[1]/button",
        "/html/body/div[2]/div[3]/form/div[1]/div[2]/div[2]/div[3]/p/span[2]/button[1]",
        "/html/body/div[2]/div[3]/form/div[1]/div[2]/div[2]/p/span/button[1]"
    ];

    function findElementByXPath(doc, xpath) {
        let element = null;
        try {
            element = doc.evaluate(xpath, doc, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        } catch (e) {
            console.log(`Error evaluating XPath ${xpath}:`, e);
        }
        if (!element) {
            const iframes = doc.getElementsByTagName('iframe');
            for (let iframe of iframes) {
                try {
                    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                    element = iframeDoc.evaluate(xpath, iframeDoc, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                    if (element) break;
                    element = findElementByXPath(iframeDoc, xpath);
                    if (element) break;
                } catch (e) {
                    console.log('Error accessing iframe:', iframe.src, e);
                }
            }
        }
        return element;
    }

    function simulateClick(element) {
        if (element) {
            try {
                element.click();
                element.dispatchEvent(new Event('click', {
                    bubbles: true
                }));
                console.log(`Clicked element:`, element);
                return true;
            } catch (e) {
                console.log(`Error clicking element:`, e);
                return false;
            }
        }
        return false;
    }

    function performClickForStep(step) {
        const xpath = clickPaths[step];
        if (!xpath) {
            console.log('No more steps to execute.');
            GM_setValue('clickStep', 0);
            GM_setValue('clickEnabled', false); // Desativa após último passo
            return false;
        }

        const element = findElementByXPath(document, xpath);
        console.log(`Attempting step ${step} at XPath ${xpath}:`, element);

        if (element) {
            if (simulateClick(element)) {
                const nextStep = step + 1;
                GM_setValue('clickStep', nextStep);
                console.log(`Step ${step} done. Advancing to step ${nextStep}`);
                if (nextStep >= clickPaths.length) {
                    console.log('Last step reached. Disabling auto-click.');
                    GM_setValue('clickEnabled', false); // Desativa após último passo
                }
                return true;
            }
        } else {
            console.log(`Element not found for XPath ${xpath}. Will retry.`);
        }
        return false;
    }

    function addCustomButton() {
        const button = document.createElement('button');
        button.textContent = 'Relação para o DB'
        button.style.position = 'fixed';
        button.style.top = '10px';
        button.style.right = '10px';
        button.style.zIndex = '9999';
        button.style.padding = '10px 20px';
        button.style.backgroundColor = '#4CAF50';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.style.fontSize = '16px';

        button.onclick = function() {
            console.log('Botão ativado. Iniciando sequência...');
            GM_setValue('clickStep', 0);
            GM_setValue('clickEnabled', true);
            retryActions();
        };

        document.body.appendChild(button);
        console.log('Botão personalizado adicionado à página.');
    }

    function retryActions() {
        if (!GM_getValue('clickEnabled', false)) {
            return;
        }

        let attempts = 0;
        const maxAttempts = 60;

        const interval = setInterval(function() {
            if (attempts >= maxAttempts) {
                console.log('Número máximo de tentativas atingido.');
                clearInterval(interval);
                return;
            }

            if (!GM_getValue('clickEnabled', false)) {
                clearInterval(interval);
                return;
            }

            const currentStep = GM_getValue('clickStep', 0);
            if (currentStep >= clickPaths.length) {
                console.log('Todos os passos concluídos.');
                GM_setValue('clickStep', 0);
                GM_setValue('clickEnabled', false);
                clearInterval(interval);
                return;
            }

            if (performClickForStep(currentStep)) {
                clearInterval(interval);
            }

            attempts++;
        }, 500);
    }

    // MutationObserver para reagir a mudanças no DOM
    const observer = new MutationObserver(function() {
        if (GM_getValue('clickEnabled', false)) {
            retryActions();
        }
    });

    observer.observe(document, {
        childList: true,
        subtree: true
    });

    // Adiciona o botão na inicialização
    window.addEventListener('load', () => {
        addCustomButton();
    });
})();