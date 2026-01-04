// ==UserScript==
// @name         GGMAX-Mateus
// @namespace    http://tampermonkey.net/
// @version      15.0
// @description  Script para interagir com um elemento usando XPath no site GGMax com atraso e realizar a divisão
// @author       Você
// @license      MateusFagnds
// @match        https://ggmax.com.br/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/484736/GGMAX-Mateus.user.js
// @updateURL https://update.greasyfork.org/scripts/484736/GGMAX-Mateus.meta.js
// ==/UserScript==

(function () {
  'use strict';
  const TARGET_URL = 'https://ggmax.com.br/conta';
  const XPATH_EXPRESSION = '//*[@id="__layout"]/div/div[3]/div[3]/div/div/div/div[1]/div/div/div[3]/div[2]/div/div[2]/div/div/h3/span';
  const DELAY_INTERVAL = 3000;
  const UPDATE_INTERVAL = 1000;

  function getElementByXPath(xpath) {
    return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  }

  function createTooltipElement() {
    const tooltipElement = document.createElement('span');
    tooltipElement.textContent = 'Faturamento real sem o desconto da plataforma';
    tooltipElement.style.display = 'none';
    tooltipElement.style.position = 'absolute';
    tooltipElement.style.background = '#343a40';
    tooltipElement.style.color = '#ffffff';
    tooltipElement.style.padding = '5px';
    tooltipElement.style.border = 'none';
    tooltipElement.style.borderRadius = '8px';
    tooltipElement.style.top = '100%';
    tooltipElement.style.left = '0';
    tooltipElement.style.zIndex = '1';
    tooltipElement.style.whiteSpace = 'nowrap';

    return tooltipElement;
  }

  function addStylesToElement(element) {
    element.style.fontSize = '14px';
    element.style.color = '#999999';
    element.style.position = 'relative';
  }

  function handleTooltipEvents(resultElement, tooltipElement) {
    resultElement.addEventListener('mouseover', () => {
      tooltipElement.style.display = 'block';
    });

    resultElement.addEventListener('mouseout', () => {
      tooltipElement.style.display = 'none';
    });
  }

  function createResultElement() {
    const resultElement = document.createElement('div');
    resultElement.id = 'resultadoDiv';

    const valueElement = document.createElement('span');
    valueElement.setAttribute('data-value-element', '');

    const tooltipElement = createTooltipElement();
    handleTooltipEvents(resultElement, tooltipElement)

    addStylesToElement(resultElement);
    addStylesToElement(valueElement)

    resultElement.appendChild(valueElement)
    resultElement.appendChild(tooltipElement);

    return resultElement;
  }

  function updateResultElement(resultElement, result) {
    const formattedResult = formatNumber(result);
    const valueElement = resultElement.querySelector('[data-value-element]');

    valueElement.innerHTML = `R$ ${formattedResult}`;
  }

  function removeResultElement() {
    const previousElement = document.getElementById('resultadoDiv');
    if (previousElement) {
      previousElement.parentNode.removeChild(previousElement);
    }
  }

  function addResultElement(result) {
    removeResultElement();

    const newElement = createResultElement(result);
    const targetElement = getElementByXPath(XPATH_EXPRESSION);

    if (targetElement) {
      targetElement.parentNode.appendChild(newElement);


    } else {
      console.log('Elemento não encontrado');
    }

    updateResultElement(newElement, result);
  }

  function checkAndUpdateResults() {
    const element = getElementByXPath(XPATH_EXPRESSION);
    const valueString = element.textContent.match(/[\d,.-]+/);

    if (element && valueString) {
      const value = parseFloat(valueString[0].replace(/[,.]/g, ''));
      const roundedResult = (Math.round((value / 100) / 0.84)).toFixed(2);

      addResultElement(roundedResult);
    }
  }

  function formatNumber(number) {
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(number || 0);
  }

  setTimeout(function () {
    const element = getElementByXPath(XPATH_EXPRESSION);

    if (element) {
      setInterval(checkAndUpdateResults, UPDATE_INTERVAL);
    } else {
      console.log('Elemento não encontrado');
    }
  }, DELAY_INTERVAL);
  function initializeScript() {
    if (isTargetPage()) {
      setTimeout(function () {
        const element = getElementByXPath(XPATH_EXPRESSION);

        if (element) {
          setInterval(checkAndUpdateResults, UPDATE_INTERVAL);
        } else {
          console.log('Elemento não encontrado');
        }
      }, DELAY_INTERVAL);
    } else {
      console.log('Não está na página alvo.');
    }
  }

  initializeScript();
})();
