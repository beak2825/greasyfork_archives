// ==UserScript==
// @name        No Blur RespondeAí
// @namespace   Violentmonkey Scripts
// @match       *://*.respondeai.com.br/*
// @run-at document-idle
// @grant       none
// @version     2.6
// @author      thihxm
// @description Libera o acesso aos conteúdos da plataforma sem precisar fazer login
// @downloadURL https://update.greasyfork.org/scripts/429744/No%20Blur%20RespondeA%C3%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/429744/No%20Blur%20RespondeA%C3%AD.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const removePaywall = () => {
    document.querySelectorAll('login-disclaimer').forEach((disclaimer) => {
      disclaimer.parentNode.removeChild(disclaimer);
    });
    document.querySelectorAll('overlay-disclaimer').forEach((disclaimer) => {
      disclaimer.parentNode.removeChild(disclaimer);
    });
    document.querySelectorAll('.blur').forEach((element) => {
      element.classList.remove('blur');
    });
    document.querySelectorAll('.expand-btn').forEach((element) => {
      if (element.innerHTML === 'MOSTRAR SOLUÇÃO COMPLETA') {
        element.parentNode.removeChild(element);
      }
    });
    document.querySelectorAll('.ReactModalPortal').forEach((disclaimer) => {
      disclaimer.parentNode.removeChild(disclaimer);
      document.body.classList.remove('ReactModal__Body--open');
    });
    const loginAlertTexts = Array.from(document.querySelectorAll('h2')).filter(el => el.innerText.includes('Loga aí pra continuar'));
    loginAlertTexts.forEach(loginAlert => {
      const parentEl = loginAlert.parentNode;
      parentEl.parentNode.removeChild(parentEl);
    });

    const exerciseContainer = document.querySelector('div[class^="BookEditionPage__Container"]');
    if (exerciseContainer) observerPaywall.observe(exerciseContainer, observerPaywallConfig);
  }
  window.removePaywall = removePaywall;

  const observerStyle = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      mutation.target.removeAttribute("style");
    });
  });

  const observerPaywall = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      removePaywall();
    });
  });

  const observerStyleConfig = {
    attributes: true,
    attributeOldValue: true,
  }

  const observerPaywallConfig = {
    ...observerStyleConfig,
    childList: true,
  }

  const overlay = document.querySelector('.login-overlay');
  const main_wrapper = document.querySelector('.main-wrapper') || document.querySelector('.main-container');
  const btn = document.querySelector('#exercise-expand-button');

  const style = document.createElement('style');
  style.innerHTML =
    '.content-card * {' +
      'user-select: auto !important;' +
    '}' +
    '.blur {' +
      '-webkit-filter: none !important;' +
      'filter: none !important;' +
      'pointer-events: all;' +
    '}';
  document.querySelector('head').appendChild(style);

  if (overlay) observerStyle.observe(overlay, observerStyleConfig);
  if (main_wrapper) observerStyle.observe(main_wrapper, observerStyleConfig);
  observerPaywall.observe(document.body, observerStyleConfig);

  window.onload = () => {
    removePaywall();
  }

  btn && btn.parentNode.removeChild(btn);
  overlay && overlay.parentNode.removeChild(overlay);
})();