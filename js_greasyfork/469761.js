// ==UserScript==
// @name dSenhas
// @namespace http://tampermonkey.net/
// @version 0.3
// @description Sistema de senha
// @author Mikill
// @match https://animefire.net/*
// @icon https://animefire.net/uploads/cmt/317030_1688556659.webp
// @grant GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/469761/dSenhas.user.js
// @updateURL https://update.greasyfork.org/scripts/469761/dSenhas.meta.js
// ==/UserScript==

(function() {
  'use strict';

  function fetchAprovados() {
    fetch('https://raw.githubusercontent.com/Mikill73/AnimeFireMod/main/Mod/Aprovados.txt')
      .then(response => response.text())
      .then(data => {
        const links = data.split(' ');
        const cookieValue = links.join(' ');

        document.cookie = `aprovados=${cookieValue}; max-age=60`;
      });
  }

  function updateAprovados() {
    const aprovadosCookie = document.cookie.replace(/(?:(?:^|.*;\s*)aprovados\s*\=\s*([^;]*).*$)|^.*$/, '$1');
    const lastAprovados = aprovadosCookie.split(' ');

    fetchAprovados();

    setInterval(() => {
      fetchAprovados();

      const newAprovadosCookie = document.cookie.replace(/(?:(?:^|.*;\s*)aprovados\s*\=\s*([^;]*).*$)|^.*$/, '$1');
      const newAprovados = newAprovadosCookie.split(' ');

      if (newAprovados.length !== lastAprovados.length || !newAprovados.every((link, index) => link === lastAprovados[index])) {
        lastAprovados = newAprovados;
      }
    }, 10000);
  }

  function handlePageReload() {
    window.addEventListener('load', () => {
      fetchAprovados();
    });
  }

  function checkMeuPerfil() {
    const aprovadosCookie = document.cookie.replace(/(?:(?:^|.*;\s*)aprovados\s*\=\s*([^;]*).*$)|^.*$/, '$1');
    const aprovados = aprovadosCookie.split(' ');
    const meuPerfilLink = document.querySelector('a.dropdown-item.py-2.px-4.meu-perfil').getAttribute('href');

    if (aprovados.includes(meuPerfilLink)) {
      const umDiaEmSegundos = 24 * 60 * 60;
      document.cookie = `prmt=true; max-age=${umDiaEmSegundos}; path=/`;
    } else {
      document.cookie = 'prmt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    }
  }

  function deletePrmtCookie() {
    const dropdownLink = document.querySelector('a.dropdown-item.py-2.px-4.meu-perfil');
    const aprovadosCookie = document.cookie.replace(/(?:(?:^|.*;\s*)aprovados\s*\=\s*([^;]*).*$)|^.*$/, '$1');
    const aprovados = aprovadosCookie.split(' ');

    if (!dropdownLink || !aprovados.includes(dropdownLink.getAttribute('href'))) {
      document.cookie = 'prmt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    }
  }

  updateAprovados();
  handlePageReload();
  setInterval(checkMeuPerfil, 2000);
  deletePrmtCookie();

})();