// ==UserScript==
// @name         Dublanet – Link no horário do último post
// @namespace    https://dublanet.com.br/
// @version      1
// @description  Link no horário do último post
// @match        https://www.dublanet.com.br/comunidade/forumdisplay.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537140/Dublanet%20%E2%80%93%20Link%20no%20hor%C3%A1rio%20do%20%C3%BAltimo%20post.user.js
// @updateURL https://update.greasyfork.org/scripts/537140/Dublanet%20%E2%80%93%20Link%20no%20hor%C3%A1rio%20do%20%C3%BAltimo%20post.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const rows = document.querySelectorAll('.row.pt-3');

  rows.forEach(row => {
    const threadLink = row.querySelector('.col.align-self-center > a[href*="showthread.php?tid="]');
    if (!threadLink) return;
    const tidMatch = threadLink.href.match(/tid=(\d+)/);
    if (!tidMatch) return;
    const tid = tidMatch[1];
    const lastpostUrl = `showthread.php?tid=${tid}&action=lastpost`;

    const col = row.querySelector('.col-2.text-start.text-muted.align-self-center');
    if (!col) return;

    const userLink = col.querySelector('a[href*="member.php?action=profile"]');
    if (!userLink) return;

    const br = col.querySelector('br');
    if (!br) return;

    let nodes = [];
    let currentNode = br.nextSibling;
    while (currentNode) {
      if (currentNode.nodeType === Node.TEXT_NODE) {
        if (currentNode.textContent.trim() !== '') nodes.push(currentNode);
      } else if (currentNode.nodeType === Node.ELEMENT_NODE) {
        nodes.push(currentNode);
      }
      currentNode = currentNode.nextSibling;
    }

    if (nodes.length === 0) return;

    // Caso 1: span com title (ex: "5 minutos atrás")
    if (nodes[0].nodeType === Node.ELEMENT_NODE && nodes[0].tagName === 'SPAN' && nodes[0].hasAttribute('title')) {
      const span = nodes[0];
      const textoVisivel = span.textContent;
      const dataCompleta = span.getAttribute('title');

      if (span.parentElement.tagName === 'A') return;

      const link = document.createElement('a');
      link.href = lastpostUrl;
      link.textContent = textoVisivel; // mantém o texto visível original
      link.title = dataCompleta; // tooltip com data completa
      link.style.cursor = 'pointer';

      col.replaceChild(link, span);

      for (let i = 1; i < nodes.length; i++) {
        col.removeChild(nodes[i]);
      }
      return;
    }

    // Caso 2: span + texto (ex: "Ontem, 23:04 rd")
    if (
      nodes.length >= 2 &&
      nodes[0].nodeType === Node.ELEMENT_NODE &&
      nodes[0].tagName === 'SPAN' &&
      nodes[1].nodeType === Node.TEXT_NODE
    ) {
      const textoData = nodes[0].textContent.trim() + nodes[1].textContent.trim();

      if (nodes[0].parentElement.tagName === 'A') return;

      const link = document.createElement('a');
      link.href = lastpostUrl;
      link.textContent = textoData;
      link.style.cursor = 'pointer';

      col.replaceChild(link, nodes[0]);
      col.removeChild(nodes[1]);
      return;
    }

    // Caso 3: texto simples (ex: "13-04-2025, 13:30 th")
    if (nodes[0].nodeType === Node.TEXT_NODE) {
      const textoData = nodes[0].textContent.trim();

      if (nodes[0].parentElement.tagName === 'A') return;

      const link = document.createElement('a');
      link.href = lastpostUrl;
      link.textContent = textoData;
      link.style.cursor = 'pointer';

      col.replaceChild(link, nodes[0]);
      return;
    }

  });
})();
