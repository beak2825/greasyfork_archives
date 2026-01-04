// ==UserScript==
// @name         cirrusretro.com - запись музыки в файл
// @namespace    http://tampermonkey.net/
// @version      0.22
// @description  Capture Audio Web Audio API - Capture audio and save with track name and author
// @author       ISJ
// @match        https://cirrusretro.com/listen/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/517757/cirrusretrocom%20-%20%D0%B7%D0%B0%D0%BF%D0%B8%D1%81%D1%8C%20%D0%BC%D1%83%D0%B7%D1%8B%D0%BA%D0%B8%20%D0%B2%20%D1%84%D0%B0%D0%B9%D0%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/517757/cirrusretrocom%20-%20%D0%B7%D0%B0%D0%BF%D0%B8%D1%81%D1%8C%20%D0%BC%D1%83%D0%B7%D1%8B%D0%BA%D0%B8%20%D0%B2%20%D1%84%D0%B0%D0%B9%D0%BB.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Найти кнопку Loop track
  const loopButton = document.getElementById('loopButton');

  if (!loopButton) {
    console.error('Кнопка Loop track не найдена');
    return;
  }

  // Создаём контейнер для кнопок
  const buttonContainer = loopButton.parentNode;

  // Добавляем кнопку записи рядом с Loop track
  const saveButton = document.createElement('button');
  saveButton.textContent = 'Записать музыку';
  saveButton.style.padding = '10px';
  saveButton.style.backgroundColor = 'green';
  saveButton.style.color = 'white';
  saveButton.style.marginLeft = '10px'; // Отступ от кнопки Loop track

  buttonContainer.appendChild(saveButton);

  // Добавляем выпадающий список форматов с MP3 по умолчанию
  const formatSelect = document.createElement('select');
  formatSelect.innerHTML = `
    <option value="wav">WAV</option>
    <option value="mp3" selected>MP3</option>
    <option value="ogg">OGG</option>
  `;
  formatSelect.style.marginLeft = '10px'; // Отступ от кнопки записи

  buttonContainer.appendChild(formatSelect);

  let audioChunks = [];
  let mediaRecorder;
  let trackInfoOnStart = { name: 'Unknown Track', author: 'Unknown Author' };

  // Функция для получения текущего трека из URL
  function getCurrentTrackNumber() {
    const url = window.location.href;
    const match = url.match(/#(\d+)$/);
    return match ? match[1] : null;
  }

  // Функция для получения информации о треке (название и автор)
  function getTrackInfoByNumber(trackNumber) {
    const trackRow = document.querySelector(`#song_row_${trackNumber}`);
    if (trackRow) {
      const trackNameCell = trackRow.querySelector('td:nth-child(3)');
      const trackAuthorCell = trackRow.querySelector('td:nth-child(5)');
      return {
        name: trackNameCell ? trackNameCell.textContent : `Track ${trackNumber}`,
        author: trackAuthorCell ? trackAuthorCell.textContent : 'Unknown Author'
      };
    }
    return { name: `Track ${trackNumber}`, author: 'Unknown Author' };
  }

  // Перехват создаваемых аудио контекстов
  const originalAudioContext = window.AudioContext;
  window.AudioContext = class extends originalAudioContext {
    constructor(...args) {
      super(...args);
      const dest = this.createMediaStreamDestination();

      // Подключение всех аудиовыходов к MediaStreamDestination
      this.originalCreateGain = this.createGain;
      this.createGain = function () {
        const gainNode = this.originalCreateGain();
        gainNode.connect(dest);
        return gainNode;
      };

      // Инициализация MediaRecorder
      mediaRecorder = new MediaRecorder(dest.stream);
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunks.push(e.data);
      };
      mediaRecorder.onstop = () => {
        const fileName = `${trackInfoOnStart.name} - ${trackInfoOnStart.author}.${formatSelect.value}`;
        const blob = new Blob(audioChunks, { type: `audio/${formatSelect.value}` });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
        audioChunks = [];
      };
    }
  };

  saveButton.addEventListener('click', () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
      saveButton.textContent = 'Записать музыку';
      saveButton.style.backgroundColor = 'green';
    } else if (mediaRecorder) {
      const trackNumber = getCurrentTrackNumber();
      trackInfoOnStart = trackNumber ? getTrackInfoByNumber(trackNumber) : { name: 'audio_capture', author: 'Unknown Author' };
      mediaRecorder.start();
      saveButton.textContent = 'Остановить запись';
      saveButton.style.backgroundColor = 'red';
    } else {
      console.error('MediaRecorder не был инициализирован');
    }
  });
})();
