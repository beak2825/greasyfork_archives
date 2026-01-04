// ==UserScript==
// @name         gP0rnBlocker
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Bloqueia certos perfis que postam pornografia, adicione mais perfis no discord, atualiza a cada 20 segundos!
// @author       Mikill
// @match        https://animefire.net/*
// @grant        none
// @icon         https://animefire.net/uploads/cmt/317030_1688556659.webp
// @downloadURL https://update.greasyfork.org/scripts/469813/gP0rnBlocker.user.js
// @updateURL https://update.greasyfork.org/scripts/469813/gP0rnBlocker.meta.js
// ==/UserScript==

(function() {
  'use strict';

  function checkCookiesExist() {
    const cacheCookie = document.cookie.includes('cache=');
    const prmtCookie = document.cookie.includes('prmt=');

    return cacheCookie && prmtCookie;
  }

  function createOrUpdateCookie(name, value) {
    const existingCookie = document.cookie.match(`(^|;)\\s*${name}\\s*=\\s*([^;]+)`);
    if (existingCookie) {
      document.cookie = `${name}=${value};`;
    } else {
      document.cookie = `${name}=${value};`;
    }
  }

  function deleteAllBlockCookies() {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.indexOf('block=') === 0) {
        const cookieName = cookie.split('=')[0];
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      }
    }
  }

  function obterListaBloqueados() {
    deleteAllBlockCookies();

    fetch('https://raw.githubusercontent.com/Mikill73/AnimeFireMod/main/Mod/Lista%20Bloqueados.txt')
      .then(response => response.text())
      .then(data => {
        const linksBloqueados = data.split(' ').filter(link => link.trim() !== '');
        createOrUpdateCookie('block', linksBloqueados.join(' '));
      })
      .catch(error => {
        console.error('Erro ao obter a lista de links bloqueados:', error);
      });
  }

  function verificarEaplicarEstilo() {
    const linksBloqueados = document.cookie.replace(/(?:(?:^|.*;\s*)block\s*\=\s*([^;]*).*$)|^.*$/, '$1');
    const divElements = document.querySelectorAll('div.ml-2');

    for (let i = 0; i < divElements.length; i++) {
      const divElement = divElements[i];
      const anchorElement = divElement.querySelector('a');

      if (anchorElement && linksBloqueados.includes(anchorElement.href)) {
        divElement.style.color = 'red';
        divElement.innerText = 'Mensagem Bloqueada! Esse usuário está na lista de perfis bloqueados por alguma razão, você pode pedir para adicionar mais usuários a lista de bloqueados no site lista-block, com uma print de prova, o usuário deve ter postado pornografia ou soft porn para entrar na lista de bloqueados, essa lista é verificada a cada 20 segundos, sem a necessidade da instalação de outra versão para bloquear novos perfis!!';
      }
    }
  }

  function init() {
    if (!checkCookiesExist()) {
      return;
    }

    obterListaBloqueados();

    setInterval(verificarEaplicarEstilo, 250);
    setInterval(obterListaBloqueados, 10000);
  }

  setInterval(() => {
    if (checkCookiesExist()) {
      init();
    }
  }, 10000);
})();
