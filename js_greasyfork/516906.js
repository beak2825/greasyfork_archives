// ==UserScript==
// @name         printables_hide_by_keywords
// @namespace    https://greasyfork.org/de/users/157797-lual
// @version      0.2
// @description  hide articles matching some keywords / coded in cooperation with perplexity ai ;) To add words see menue of script
// @author       lual
// @match        https://www.printables.com/*
// @icon         https://icons.duckduckgo.com/ip2/prusaprinters.org.ico
// @license MIT
// @grant    GM_getValue
// @grant    GM_setValue
// @grant    GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/516906/printables_hide_by_keywords.user.js
// @updateURL https://update.greasyfork.org/scripts/516906/printables_hide_by_keywords.meta.js
// ==/UserScript==
//
(function() {
  'use strict';

  ////////////////////////////////////////////////////////////////////
  // wortliste im browser verwalten...
  //
  // Initiale Wortliste
  let wordsToHide = GM_getValue('wordsToHide', ['gridfinity', 'benchy']);

  // Speichern der initialen Liste, falls sie noch nicht existiert
  if (!GM_getValue('wordsToHide')) {
    GM_setValue('wordsToHide', wordsToHide);
  }

  function addWord() {
    const newWord = prompt('Geben Sie ein neues Wort zum Verbergen ein:');
    if (newWord && !wordsToHide.includes(newWord)) {
      wordsToHide.push(newWord);
      GM_setValue('wordsToHide', wordsToHide);
      alert(`"${newWord}" wurde zur Liste hinzugefügt.`);
      loadWords();
      forgetCheckedArticles();
      hideAndReplaceArticles();
    }
  }

  function removeWord() {
    const wordToRemove = prompt('Geben Sie das zu entfernende Wort ein:');

    const index = wordsToHide.indexOf(wordToRemove);
    if (index > -1) {
      wordsToHide.splice(index, 1);
      GM_setValue('wordsToHide', wordsToHide);
      alert(`"${wordToRemove}" wurde aus der Liste entfernt. (Bitte Seite neu laden (F5))`);
      loadWords();
      forgetCheckedArticles();
    } else {
      alert(`"${wordToRemove}" wurde nicht in der Liste gefunden.`);
    }
  }

  function showWords() {
    alert('Aktuelle Liste der zu verbergenden Wörter:\n' + wordsToHide.join(', '));
  }

  GM_registerMenuCommand('Wort hinzufügen', addWord);
  GM_registerMenuCommand('Wort entfernen', removeWord);
  GM_registerMenuCommand('Wortliste anzeigen', showWords);

  // Hauptfunktion zum Verbergen der Wörter
  function loadWords() {
    // Holen Sie sich die aktuelle Liste der zu verbergenden Wörter
    wordsToHide = GM_getValue('wordsToHide', []);
  }

  loadWords();
  //alert('Aktuelle Liste der zu verbergenden Wörter:\n' + wordsToHide.join(', '));

  ///////////////////////////////////////////////////////////////////////////



  // Objekt zur Verfolgung der Anzahl der ausgeblendeten Artikel pro Wort
  const wordCounters = {};
  wordsToHide.forEach(word => wordCounters[word] = 0);

  function forgetCheckedArticles() {
    const articles = document.querySelectorAll('article');
    articles.forEach(article => {
      article.dataset.checked = 'false';
    });
  }

  function hideAndReplaceArticles() {
    const articles = document.querySelectorAll('article');

    articles.forEach(article => {
      if (article.dataset.checked) return; // Überspringe bereits überprüfte Artikel

      const hDiv = article.querySelector('article div div div h5 a.h.clamp-two-lines');

      if (hDiv) {

        const textorig = hDiv.textContent;
        const text = hDiv.textContent.toLowerCase();

        for (const word of wordsToHide) {
          if (text.includes(word.toLowerCase())) {
            wordCounters[word]++;
            const replacementDiv = document.createElement('div');
            replacementDiv.className = 'article-replacement';
            replacementDiv.style.cssText = `
                            color: #555555;
                            #background-color: #f0f0f0;
                            padding: 10px;
                            margin: 0px 0;
                            border: 1px solid #555555;
                            border-radius: 1px;
                            font-style: italic;
                        `;

            // Hinweis Dv
            const hinweisDiv = document.createElement('div');


            hinweisDiv.textContent = `(Hidden - because keyword "${word}" was found (${wordCounters[word]}))`;
            hinweisDiv.style.cssText = `
                            color: #555555;
                            font-size: 14px;
                            #background-color: #f0f0f0;
                            padding: 10px;
                            margin: 0px 0;
                            #border: 1px solid #555555;
                            #border-radius: 1px;
                            font-style: italic;
                        `;
            replacementDiv.appendChild(hinweisDiv);

            // Zusätzliches Div
            const additionalDiv = document.createElement('div');
            additionalDiv.className = 'additional-content';
            additionalDiv.textContent = ` ${textorig} `;
            additionalDiv.style.cssText = `
                            padding: 10px;
                            font-size: 16px;
                            font-weight: 700
                        `;
            // replacementDiv.appendChild(additionalDiv);
            hDiv.style.cssText = `
                            color: #555555;
                            padding: 10px;
                            font-size: 16px;
                            font-weight: 700
                        `;
            replacementDiv.appendChild(hDiv);

            article.parentNode.replaceChild(replacementDiv, article);
            break;
          }
        }
      }
      article.dataset.checked = 'true'; // Markiere den Artikel als überprüft
    });
  }

  // Throttle-Funktion zur Leistungsoptimierung
  function throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  // Funktion zum Ausführen des Skripts
  function runScript() {
    hideAndReplaceArticles();
    // Füge einen Scroll-Event-Listener hinzu
    window.addEventListener('scroll', throttle(hideAndReplaceArticles, 250));
  }

  // Führe das Skript aus, wenn das DOM geladen ist
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runScript);
  } else {
    runScript();
  }

  // Zusätzlicher MutationObserver für dynamisch geladene Inhalte
  const observer = new MutationObserver(throttle(() => {
    hideAndReplaceArticles();
  }, 250));

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
})();
