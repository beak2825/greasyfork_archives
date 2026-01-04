// ==UserScript==
// @name     WordSleuth-Fork
// @namespace  https://greasyfork.org/en/users/1084087-fermion
// @version   0.6.2
// @description A script that helps you guess words in skribblio
// @author    fermion
// @match    http*://www.skribbl.io/*
// @match    http*://skribbl.io/*
// @icon     https://www.google.com/s2/favicons?sz=64&domain=skribbl.io
// @grant    GM_setValue
// @grant    GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/495270/WordSleuth-Fork.user.js
// @updateURL https://update.greasyfork.org/scripts/495270/WordSleuth-Fork.meta.js
// ==/UserScript==
(function() {
  'use strict';

  class WordSleuth {
    constructor() {
      this.correctAnswers = GM_getValue('correctAnswers', []);
      this.possibleWords = [];
      this.tempWords = [];
      this.alreadyGuessed = [];
      this.closeWord = '';
      this.players = {};
      this.createParentElement();
      this.createGuessElement();
      this.createExportButton();
      this.fetchAndStoreLatestWordlist();
      this.observeHintsAndInput();
      this.observePlayers();
      this.createAutoGuessToggle();
      this.autoGuessing = false;
      this.autoGuessInterval = null;
      this.createDelayInput();
      this.autoGuessDelay = 1500;

      this.adminList = [1416559798, 2091817853];
    }

    createAutoGuessToggle() {
      this.autoGuessButton = document.createElement('button');
      this.autoGuessButton.innerHTML = 'Auto Guess: OFF';
      this.autoGuessButton.style = 'position: absolute; bottom: calc(100% + 10px); right: 100px; z-index: 9999; padding: 5px 10px; font-size: 12px; background-color: #333; color: #fff; border: none; border-radius: 5px;';
      this.parentElement.appendChild(this.autoGuessButton);
      this.autoGuessButton.addEventListener('click', () => this.toggleAutoGuess());
    }


    toggleAutoGuess() {
      this.autoGuessing = !this.autoGuessing;
      this.autoGuessButton.innerHTML = `Auto Guess: ${this.autoGuessing ? 'ON' : 'OFF'}`;

      if (this.autoGuessing) {
        this.startAutoGuessing();
      } else {
        this.stopAutoGuessing();
      }
    }

    startAutoGuessing() {
      if (this.autoGuessInterval) return;

      this.autoGuessInterval = setInterval(() => {
        if (this.possibleWords.length > 0) {
          const inputElem = document.querySelector('#game-chat input[data-translate="placeholder"]');
          const formElem = document.querySelector('#game-chat form');
          inputElem.value = this.possibleWords.shift();
          formElem.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
          if (this.possibleWords.length === 0) {
            this.stopAutoGuessing();
          }
        }
      }, this.autoGuessDelay);
    }

    stopAutoGuessing() {
      clearInterval(this.autoGuessInterval);
      this.autoGuessInterval = null;
    }

    createDelayInput() {
      this.delayInput = document.createElement('input');
      this.delayInput.type = 'number';
      this.delayInput.min = '500';
      this.delayInput.value = '2000';
      this.delayInput.style = 'position: absolute; bottom: calc(100% + 10px); right: 220px; z-index: 9999; padding: 10px; width: 75px; font-size: 12px; background-color: #fff; color: #333; border: 1px solid #ccc; border-radius: 5px; height: 25px;';
      this.parentElement.appendChild(this.delayInput);

      this.delayInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
          this.updateAutoGuessDelay();
        }
      });
    }

    updateAutoGuessDelay() {
      const newDelay = parseInt(this.delayInput.value);
      if (isNaN(newDelay) || newDelay < 500) {
        alert('Please enter a valid delay (minimum 500 ms).');
        return;
      }
      this.autoGuessDelay = newDelay;
      if (this.autoGuessing) {
        this.stopAutoGuessing();
        this.startAutoGuessing();
      }
    }

    createParentElement() {
      this.parentElement = document.createElement('div');
      this.parentElement.style = 'position: fixed; bottom: 0; right: 0; width: 100%; height: auto;';
      document.body.appendChild(this.parentElement);
    }

    createGuessElement() {
      this.guessElem = document.createElement('div');
      this.guessElem.style = 'padding: 10px; background-color: white; max-height: 200px; overflow-x: auto; white-space: nowrap; width: 100%;';
      this.parentElement.appendChild(this.guessElem);
    }

    createExportButton() {
      this.exportButton = document.createElement('button');
      this.exportButton.innerHTML = 'Export Answers';
      this.exportButton.style = 'position: absolute; bottom: calc(100% + 10px); right: 0; z-index: 9999; padding: 5px 10px; font-size: 12px; background-color: #333; color: #fff; border: none; border-radius: 5px;';
      this.parentElement.appendChild(this.exportButton);
      this.exportButton.addEventListener('click', () => this.exportNewWords());
    }

    exportNewWords() {
      this.fetchWords('https://raw.githubusercontent.com/kuel27/wordlist/main/wordlist.txt').then(latestWords => {
        const newWords = this.correctAnswers.filter(word => !latestWords.includes(word));

        let blob = new Blob([newWords.join('\n')], {
          type: 'text/plain;charset=utf-8'
        });
        let a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'newWords.txt';
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      });
    }

    fetchAndStoreLatestWordlist() {
      this.fetchWords('https://raw.githubusercontent.com/kuel27/wordlist/main/wordlist.txt').then(words => {
        words.forEach(word => {
          if (!this.correctAnswers.includes(word)) {
            this.correctAnswers.push(word);
          }
        });
      });
    }

    fetchWords(url) {
      return fetch(url)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          return response.text();
        })
        .then(data => data.split('\n').map(word => word.trim()))
        .catch(error => {
          console.error(`There was an error with the fetch operation: ${error.message}`);
          return [];
        });
    }

    observePlayers() {
      const playersContainer = document.querySelector(".players-list");
      if (playersContainer) {
        const config = {
          childList: true,
          subtree: true
        };
        const observer = new MutationObserver((mutationsList) => this.playersObserverCallback(mutationsList));
        observer.observe(playersContainer, config);
      }
    }

    playersObserverCallback(mutationsList) {
      for (let mutation of mutationsList) {
        if (mutation.type === 'childList') {
          this.updatePlayersList();
        }
      }
    }

    generateID(inputString) {
      let hash = 0;

      if (inputString.length === 0) {
        return hash.toString();
      }

      for (let i = 0; i < inputString.length; i++) {
        const char = inputString.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0;
      }

      return Math.abs(hash).toString();
    }

    updatePlayersList() {
      const playerElems = document.querySelectorAll(".player");
      playerElems.forEach(playerElem => {
        const colorElem = playerElem.querySelector(".color");
        const eyesElem = playerElem.querySelector(".eyes");
        const mouthElem = playerElem.querySelector(".mouth");
        const playerNameElem = playerElem.querySelector(".player-name");

        if (!mouthElem || !eyesElem || !mouthElem || !playerNameElem) {
          return;
        }

        let playerName = playerNameElem.textContent;
        const isMe = playerNameElem.classList.contains("me");

        if (isMe) {
          playerName = playerName.replace(" (You)", "");
        }

        const colorStyle = window.getComputedStyle(colorElem).backgroundPosition;
        const eyesStyle = window.getComputedStyle(eyesElem).backgroundPosition;
        const mouthStyle = window.getComputedStyle(mouthElem).backgroundPosition;

        const playerId = this.generateID(`${colorStyle}_${eyesStyle}_${mouthStyle}`);

        if (this.adminList.includes(parseInt(playerId))) {
          playerElem.style.background = "linear-gradient(to right, red, yellow)";
          playerNameElem.style.fontWeight = "bold";
        }

        this.players[playerId] = {
          element: playerElem,
          name: playerName.trim()
        };
      });
    }

    observeHintsAndInput() {
      this.observeHints();
      this.observeInput();
      this.observeChat();
    }

    observeHints() {
      const targetNodes = [
        document.querySelector('.hints .container'),
        document.querySelector('.words'),
        document.querySelector('#game-word'),
      ];
      const config = {
        childList: true,
        subtree: true
      };

      const observer = new MutationObserver((mutationsList) => this.hintObserverCallback(mutationsList));
      targetNodes.forEach(targetNode => {
        if (targetNode) {
          observer.observe(targetNode, config);
        }
      });
    }

    hintObserverCallback(mutationsList) {
      const inputElem = document.querySelector('#game-chat input[data-translate="placeholder"]');
      if (inputElem.value) return;

      for (let mutation of mutationsList) {
        if (mutation.type === 'childList') {
          this.checkIfAllHintsRevealed();
          this.checkWordsElement();
          this.generateGuesses();
        }
      }
    }

    checkIfAllHintsRevealed() {
      const hintElems = Array.from(document.querySelectorAll('.hints .hint'));

      if (hintElems.every(elem => elem.classList.contains('uncover'))) {
        const correctAnswer = hintElems.map(elem => elem.textContent).join('').trim().toLowerCase();

        if (!correctAnswer || /[^a-zA-Z.\s-]/g.test(correctAnswer)) {
          return;
        }

        if (!this.correctAnswers.includes(correctAnswer)) {
          this.correctAnswers.push(correctAnswer);
          GM_setValue('correctAnswers', this.correctAnswers);
        }
      }
    }

    observeChat() {
      const chatContainer = document.querySelector('.chat-content');
      const observer = new MutationObserver((mutationsList) => this.chatObserverCallback(mutationsList));
      observer.observe(chatContainer, {
        childList: true
      });
    }

    chatObserverCallback(mutationsList) {
      for (let mutation of mutationsList) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          let messageNode = mutation.addedNodes[0];
          let message = messageNode.textContent;
          let computedStyle = window.getComputedStyle(mutation.addedNodes[0]);

          if (computedStyle.color === 'rgb(226, 203, 0)' && message.includes('is close!')) {
            this.closeWord = message.split(' ')[0];
          }

          if (computedStyle.color === 'rgb(57, 117, 206)') {
            this.tempWords = this.correctAnswers.slice();
            this.alreadyGuessed = [];
            this.closeWord = '';
          }

          if (message.includes(': ')) {
            let username = message.split(': ')[0];
            let guess = message.split(': ')[1];
            if (!this.alreadyGuessed.includes(guess)) {
              this.alreadyGuessed.push(guess);
            }

            for (let playerId in this.players) {
              if (this.players.hasOwnProperty(playerId) &&
                this.players[playerId].name === username &&
                this.adminList.includes(Number(playerId))) {
                messageNode.style.background = 'linear-gradient(to right, #fc2d2d 40%, #750000 60%)';
                messageNode.style.webkitBackgroundClip = 'text';
                messageNode.style.webkitTextFillColor = 'transparent';
                messageNode.style.fontWeight = '700';
                messageNode.style.textShadow = '2px 2px 4px rgba(0, 0, 0, 0.3)';
                break;
              }
            }
          }

          this.generateGuesses();
        }
      }
    }

    checkWordsElement() {
      const wordElems = Array.from(document.querySelectorAll('.words.show .word'));

      wordElems.forEach(elem => {
        const word = elem.textContent.trim().toLowerCase();

        if (!word || /[^a-zA-Z.\s-]/g.test(word)) {
          return;
        }

        if (word.trim() !== "" && !this.correctAnswers.includes(word)) {
          this.correctAnswers.push(word);
          GM_setValue('correctAnswers', this.correctAnswers);
        }
      });
    }

    observeInput() {
      const inputElem = document.querySelector('#game-chat input[data-translate="placeholder"]');
      inputElem.addEventListener('input', this.generateGuesses.bind(this));
      inputElem.addEventListener('keydown', this.handleKeyDown.bind(this));

      const formElem = document.querySelector('#game-chat form');
      formElem.addEventListener('submit', this.generateGuesses.bind(this));
    }

    handleKeyDown(event) {
      if (event.key === 'Tab' && this.possibleWords.length > 0) {
        event.preventDefault();
        const inputElem = document.querySelector('#game-chat input[data-translate="placeholder"]');
        inputElem.value = this.possibleWords[0];
        inputElem.focus();
        this.generateGuesses();
      }
    }

    levenshteinDistance(a, b) {
      const matrix = [];

      for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
      }

      for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
      }

      for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
          if (b.charAt(i - 1) == a.charAt(j - 1)) {
            matrix[i][j] = matrix[i - 1][j - 1];
          } else {
            matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1,
              Math.min(matrix[i][j - 1] + 1,
                matrix[i - 1][j] + 1));
          }
        }
      }

      return matrix[b.length][a.length];
    }

    generateGuesses() {
      const hintElems = Array.from(document.querySelectorAll('.hints .hint'));
      const inputElem = document.querySelector('#game-chat input[data-translate="placeholder"]');
      const hintParts = hintElems.map(elem => elem.textContent === '_' ? '.' : elem.textContent).join('').split(' ');
      const inputText = inputElem.value ? String(inputElem.value) : '';

      this.tempWords = this.tempWords.filter(word => {
        if (this.alreadyGuessed.includes(word)) {
          return false;
        }

        if (this.closeWord.length > 0 && this.levenshteinDistance(word, this.closeWord) > 1) {
          return false;
        }

        let wordParts = word.split(' ');

        if (wordParts.length !== hintParts.length) {
          return false;
        }

        for (let i = 0, len = wordParts.length; i < len; i++) {
          if (wordParts[i].length !== hintParts[i].length) {
            return false;
          }
        }

        if (hintParts.join(' ').trim().length <= 0 && inputText.trim().length <= 0) {
          return true;
        }

        let hintRegex = new RegExp(`^${hintParts.join(' ')}$`, 'i');
        if (!hintRegex.test(word)) {
          return false;
        }

        return true;
      });

      this.possibleWords = this.tempWords.filter(word => {
        let inputTextRegex = new RegExp(`^${inputText}`, 'i');
        if (!inputTextRegex.test(word)) {
          return false;
        }

        return true;
      });

      this.closeWord = '';
      this.guessElem.innerHTML = '';
      this.renderGuesses(this.possibleWords, inputElem);
    }

    renderGuesses(possibleWords, inputElem) {
      possibleWords.slice(0, 100).forEach((word, index) => {
        const wordElem = document.createElement('div');
        wordElem.textContent = word;
        wordElem.style = 'font-weight: bold; display: inline-block; padding: 5px; margin-right: 2px; color: white; text-shadow: 2px 2px 2px black;';
        const maxValue = possibleWords.length > 100 ? 100 : possibleWords.length;
        let hueValue = possibleWords.length > 1 ? Math.floor(360 * index / (maxValue - 1)) : 0;
        wordElem.style.backgroundColor = `hsl(${hueValue}, 100%, 50%)`;

        this.addHoverEffect(wordElem, hueValue);
        this.addClickFunctionality(wordElem, word, inputElem, hueValue);
        this.guessElem.appendChild(wordElem);
      });
    }

    addHoverEffect(wordElem, hueValue) {
      wordElem.addEventListener('mouseenter', function() {
        if (!this.classList.contains('pressed')) {
          this.style.backgroundColor = 'lightgray';
        }
        this.classList.add('hovered');
      });

      wordElem.addEventListener('mouseleave', function() {
        if (!this.classList.contains('pressed')) {
          this.style.backgroundColor = `hsl(${hueValue}, 100%, 50%)`;
        }
        this.classList.remove('hovered');
      });
    }


    addClickFunctionality(wordElem, word, inputElem, colorValue) {
      wordElem.addEventListener('mousedown', function() {
        wordElem.classList.add('pressed');
        wordElem.style.backgroundColor = 'gray';
      });

      wordElem.addEventListener('mouseup', function() {
        wordElem.classList.remove('pressed');
        if (!wordElem.classList.contains('hovered')) {
          wordElem.style.backgroundColor = `rgb(${colorValue}, ${255 - colorValue}, 0)`;
        } else {
          wordElem.style.backgroundColor = 'lightgray';
        }
      });

      wordElem.addEventListener('click', function() {
        const formElem = document.querySelector('#game-chat form');
        inputElem.value = word;
        formElem.dispatchEvent(new Event('submit', {
          bubbles: true,
          cancelable: true
        }));
      });
    }
  }

  new WordSleuth();
})();