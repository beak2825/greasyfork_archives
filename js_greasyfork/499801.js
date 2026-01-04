// ==UserScript==
// @name         Random English Word Popup
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Display a random word with its definition, pronunciation, and examples
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/499801/Random%20English%20Word%20Popup.user.js
// @updateURL https://update.greasyfork.org/scripts/499801/Random%20English%20Word%20Popup.meta.js
// ==/UserScript==

(function() {
  'use strict';

  let wordsQueue = [];
  let currentWordIndex = 0;
  let popupCreated = false;
  let changeWordTimeout;
  const wordsToLoad = 50; // Загружаем по 50 слов за раз

  // Используем localStorage для хранения состояния свёрнутости
  let isPopupMinimized = localStorage.getItem('isPopupMinimized') === 'true' || false;

  function openTranslationWindow(word) {
    const parentWindowX = window.screenX;
    const parentWindowY = window.screenY + window.outerHeight;
    window.open(`https://translate.google.com/#view=home&op=translate&sl=auto&tl=ru&text=${encodeURIComponent(word)}`, '_blank', `width=500,height=500,top=${parentWindowY + 600},left=${parentWindowX + 700},popup=yes`);
  }

  GM_addStyle(`
    .word-popup-button {
      background-color: transparent;
      border: 1px solid #D3D3D3;
      color: white;
      padding: 8px 16px;
      text-align: center;
      text-decoration: none;
      display: inline-block;
      font-size: 16px;
      margin: 4px 2px;
      cursor: pointer;
      border-radius: 4px;
      transition-duration: 0.4s;
    }

    .word-popup-button:hover {
      border-color: #A9A9A9;
      box-shadow: 0 12px 16px 0 rgba(0,0,0,0.24), 0 17px 50px 0 rgba(0,0,0,0.19);
    }
  `);

  function fetchWordData(word) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "GET",
        url: `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`,
        onload: function (response) {
          try {
            const wordData = JSON.parse(response.responseText)[0];
            const definition = wordData.meanings[0].definitions[0].definition;
            const phoneticSpelling = wordData.phonetics[0] ? wordData.phonetics[0].text : 'N/A';
            let examples = "-";
            for (const meaning of wordData.meanings) {
              for (const definitionItem of meaning.definitions) {
                if (definitionItem.example) {
                  examples = `"${definitionItem.example}"`;
                  break;
                }
              }
            }
            resolve({ word, phoneticSpelling, definition, examples });
          } catch (error) {
            reject(error);
          }
        },
        onerror: function (error) {
          reject(error);
        }
      });
    });
  }

  function loadNextWord() {
    // Проверяем, нужно ли загружать ещё слова
    if (wordsQueue.length >= wordsToLoad) return;

    for (let i = wordsQueue.length; i < wordsToLoad; i++) {
      GM_xmlhttpRequest({
        method: "GET",
        url: "https://random-word-api.herokuapp.com/word?number=1",
        onload: async function(response) {
          const word = JSON.parse(response.responseText)[0];
          try {
            const wordData = await fetchWordData(word);
            wordsQueue.push(wordData);

            // Если это первое слово в очереди, создаём попап и отображаем слово
            if (wordsQueue.length === 1) {
              createPopup();
              displayWord();
            }
          } catch (error) {
            console.error("Ошибка при получении данных слова:", error);
          }
        },
        onerror: function(error) {
          console.error("Ошибка при получении случайного слова:", error);
        }
      });
    }
  }

  function displayWord() {
    if (wordsQueue.length === 0) return;

    const wordInfo = wordsQueue[currentWordIndex];
    $('#word').text(wordInfo.word);
    $('#phonetic').html(`<br><span style="font-size: smaller; color: lightgrey;">[${wordInfo.phoneticSpelling}]</span>`);
    $('#definition').text(wordInfo.definition);
    $('#examples').text(`Examples: ${wordInfo.examples}`);
  }

  function resetChangeWordTimer() {
    clearTimeout(changeWordTimeout);
    changeWordTimeout = setTimeout(showNextWord, 60000);
  }

  function createPopup() {
    if (popupCreated) return;
    popupCreated = true;

    const popupHTML = `
      <div id="wordPopup" style="position: fixed; bottom: 20px; right: 20px; width: 450px; height: 170px; background: rgba(0, 0, 0, 0.5); color: white; padding: 10px; z-index: 9999; ${isPopupMinimized ? 'display: none;' : ''}">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <h2 style="margin: 0;"><span id="word" style="font-weight: bold; color: #fff; cursor: pointer;"></span><span id="phonetic" style="font-size: smaller; color: lightgrey;"></span></h2>
          <div>
            <button id="prevWord" class="word-popup-button" style="font-size: 16px;">←</button>
            <button id="togglePopup" class="word-popup-button" style="font-size: 16px;">−</button>
            <button id="nextWord" class="word-popup-button" style="font-size: 16px;">→</button>
          </div>
        </div>
        <p id="definition" style="margin: 5px 0;"></p>
        <p id="examples" style="margin: 5px 0;"></p>
      </div>
      <div id="minimizedPopup" style="position: fixed; bottom: 20px; right: 20px; width: 30px; height: 30px; background: rgba(0, 0, 0, 0.5); color: white; padding: 5px; z-index: 9999; display: flex; justify-content: center; align-items: center; cursor: pointer; ${!isPopupMinimized ? 'display: none;' : ''}">
        <span id="expandPopup" class="word-popup-button" style="font-size: 16px;">+</span>
      </div>
    `;
    $('body').append(popupHTML);

    // При загрузке страницы проверяем состояние свёрнутости
    applyPopupState();
    $(window).on('load hashchange', applyPopupState);

    $('#togglePopup').one('click', function() {
      togglePopupState();
    });

    $('#minimizedPopup').one('click', function() {
      togglePopupState();
    });

    $('#prevWord').on('click', showPreviousWord);
    $('#nextWord').on('click', showNextWord);
    $('#word').on('click', () => openTranslationWindow($('#word').text()));
  }

  function showPreviousWord() {
    if (wordsQueue.length > 1) {
      currentWordIndex = (currentWordIndex - 1 + wordsQueue.length) % wordsQueue.length;
      displayWord();
      resetChangeWordTimer();
    }
  }

  function showNextWord() {
    if (wordsQueue.length > 0) {
      currentWordIndex = (currentWordIndex + 1) % wordsQueue.length;
      displayWord();
      resetChangeWordTimer();
      loadNextWord(); // Запускаем подгрузку новых слов
    }
  }

  // Функция для переключения состояния свёрнутости и сохранения в localStorage
  function togglePopupState() {
    $('#wordPopup').toggle();
    $('#minimizedPopup').toggle();
    isPopupMinimized = !isPopupMinimized;
    localStorage.setItem('isPopupMinimized', isPopupMinimized);
  }

  // Функция для установки состояния попапа
  function applyPopupState() {
    if (isPopupMinimized) {
      $('#wordPopup').hide();
      $('#minimizedPopup').show();
    } else {
      $('#wordPopup').show();
      $('#minimizedPopup').hide();
    }
  }

  $(document).on('keydown', function(event) {
    if (event.key === 'ArrowLeft') {
      showPreviousWord();
    } else if (event.key === 'ArrowRight') {
      showNextWord();
    }
  });

  $(document).ready(function() {
    loadNextWord(); // Загрузка первой порции слов
  });
})();