// ==UserScript==
// @name         EFP: Controllo Automatico Storie Seguite
// @namespace    http://schegge.github.io/
// @version      1.2
// @description  Controllo automatico e segnalazione di nuovi capitoli aggiunti alle storie seguite
// @author       Schegge
// @include      http*://*efpfanfic.net/
// @include      http*://*efpfanfic.net/followed.php
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/11604/EFP%3A%20Controllo%20Automatico%20Storie%20Seguite.user.js
// @updateURL https://update.greasyfork.org/scripts/11604/EFP%3A%20Controllo%20Automatico%20Storie%20Seguite.meta.js
// ==/UserScript==

(async function() {
   const current = [];
   const followPage = window.location.pathname === '/followed.php';
   let alert = '';

   if (!followPage) {
      // recuperare la pagina se non siamo in followed
      const res = await fetch('./followed.php');
      const text = await res.text();
      const doc = new DOMParser().parseFromString(text, "text/html");

      checkNewChapters(doc);

      if (alert) {
         document.querySelector('head').insertAdjacentHTML('beforeend', `<style>
            #cuore { color: #009999; font-family: Segoe UI, sans-serif; }
            #alert { display: none; position: absolute; color: #009999; background-color: #fff; padding: .4em; font-size: .9em; line-height: 1.2em; text-align: left; box-shadow: 0 0 2px 0 #009999; border-radius: .5em; margin-top: .4em; box-sizing: border-box; width: ${parseInt(document.getElementById('account').offsetWidth, 10)}px;}
            #cuore:hover + #alert { display: block!important; }
         </style>`);
         document.getElementById('secondmenu').insertAdjacentHTML('afterbegin', `<a id="cuore" href="followed.php">&#9825;</a><div id="alert">${alert}</div>`);
      }
   } else {
      checkNewChapters(document);

      document.querySelector('#corpo > div:first-child > div:nth-child(3)').insertAdjacentHTML('beforebegin', `<div style="margin: 0 10px 10px 15p; padding: 10px; color: #009999;">${alert ? alert : 'Nessun nuovo capitolo.'}<br><span id="salva" style="color: #fff; background-color: #009999; cursor: pointer; padding: 0 .5em; border-radius: .5em;">salva</span></div>`);
      document.getElementById('salva').addEventListener('click', function() {
         localStorage.setItem('followed', JSON.stringify(current));
         this.textContent = 'salvato';
      });
   }

   function checkNewChapters(element) {
      // l'elenco delle storie seguite
      element.querySelectorAll('#corpo > div:first-child > div:nth-child(3) > div').forEach((el) => {
         // la storia si trovano in un <div> che non ha id
         if (!el.getAttribute('id')) {
            // il titolo si trova nell'unico <strong> presente
            let title = el.querySelector('strong > a').textContent.trim();
            // il capitolo in un <a>
            let chapter = el.querySelector('a[href*="viewstory.php"]').textContent;
            // combacia con (numeri).(spazio)(qualunque)
            chapter = chapter.replace(/(\d+)\.\s.*/, '$1');
            // nuovo dato
            current.push([title, parseInt(chapter, 10)]);
         }
      });

      // controllare con i dati salvati se ci sono state modifiche
      const saved = JSON.parse(localStorage.getItem('followed') || '[]');
      current.forEach(s => {
         let diff = 0;
         saved.some(p => {
            if (p[0] === s[0]) {
               diff = s[1] - p[1];
               return true;
            }
            return false;
         });
         if (diff) alert += `<b>${s[0]}</b> ha ${diff} ${diff > 1 ? 'nuovi capitoli' : 'nuovo capitolo'}.<br>`;
      });
      // se si sono aggiunte storie e non sono state salvate
      if (current.length > saved.length) alert += "Hai nuove storie non salvate.";
   }

})();
