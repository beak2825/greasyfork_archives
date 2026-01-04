// ==UserScript==
// @name         歌詞入力補助 [Typing Tube]
// @namespace    https://greasyfork.org/users/500559
// @version      0.1
// @description  Typing Tubeのタイピングデータの制作にて複数行の歌詞から一行ずつ入力欄に自動でセットする
// @author       ஐ
// @match        https://typing-tube.net/movie/edit?videoid=*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/401328/%E6%AD%8C%E8%A9%9E%E5%85%A5%E5%8A%9B%E8%A3%9C%E5%8A%A9%20%5BTyping%20Tube%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/401328/%E6%AD%8C%E8%A9%9E%E5%85%A5%E5%8A%9B%E8%A3%9C%E5%8A%A9%20%5BTyping%20Tube%5D.meta.js
// ==/UserScript==

(function userscript() {
  'use strict';
  if (typeof unsafeWindow === 'object' && unsafeWindow !== window) return window.eval(`(${userscript.toString()})();`);


  let lineTextArray = [],
      isAutoloaderEnabled = false,
      conversionMode = 'kakasi',
      loadedLineText = '',
      lyricsTextarea;
  const wordsInput = document.getElementById('words');

  function loadLine(e) {
    e && e.preventDefault();
    if (!lineTextArray.length) return;
    document.getElementById('number').value = ''
    loadedLineText = wordsInput.value = lineTextArray.shift();
    lyricsTextarea.value = lineTextArray.join('\n');
    lyricsTextarea.scrollTo(0, 0);
    if (conversionMode) window['command_' + conversionMode]();
    else document.getElementById('kana').value = '';
  }

  function setAutoloader(state) {
    if (state === isAutoloaderEnabled) return;
    isAutoloaderEnabled = state;
    const executeButton = document.getElementById('lal-execute-button');
    executeButton.firstElementChild.textContent = state ? '自動入力中止' : '自動入力開始';
    executeButton.classList.toggle('active', state);
    if (state && !wordsInput.value) loadLine();
    if (!state) {
      if (wordsInput.value && wordsInput.value === loadedLineText) {
        lineTextArray.unshift(loadedLineText);
        lyricsTextarea.value = lineTextArray.join('\n');
        ['number', 'words', 'kana'].forEach(id => (document.getElementById(id).value = ''));
      }
      loadedLineText = '';
    }
  }

  function scrollToLine(targetIndex) {
    const scrollElement = document.querySelector('#lyrics div[style*="overflow-y: scroll;"]'),
          targetTr = document.getElementById('tr' + targetIndex);
    if (scrollElement && targetTr) scrollElement.scrollTo({top: targetTr.offsetTop, left: 0, behavior: 'smooth'});
  }

  function addEmptyLine(e) {
    e && e.preventDefault();
    const time = document.getElementById('time').value;
    if (!time) return;
    const newLine = [time, '', ''];
    lyrics_array.push(newLine);
    update_subtitles_table();
    reset_color_line();
    scrollToLine(lyrics_array.indexOf(newLine));
  }

  function setLineTextArray() {
    lineTextArray = lyricsTextarea.value.split('\n').map(l => l.trim()).filter(l => l);
  }

  function onConversionModeChange(e) {
    if (!e.target.checked) return;
    conversionMode = e.target.value;
    if (conversionMode && isAutoloaderEnabled) window['command_' + conversionMode]();
  }

  function onExecuteButtonClick(e) {
    e.preventDefault();
    if (!isAutoloaderEnabled && !lineTextArray.length) return lyricsTextarea.focus();
    setAutoloader(!isAutoloaderEnabled);
  }

  function addAutoloaderElements() {
    document.getElementById('edit').insertAdjacentHTML('beforeend', `
<div class="row w-100 ml-2" id="lal-extension-buttons">
  <div class="col-2"></div>
  <div class="col-2 pr-0" id="lal-add-empty-line-button">
    <button class="btn btn-outline-success m-1">空行追加</button>
  </div>
  <div class="col-2 pr-0" id="lal-next-line-button">
    <div class="btn btn-outline-warning m-1">次の行</div>
  </div>
  <div class="col-6"></div>
</div>
<div class="row ml-2 w-100 mt-3">
  <div class="col-2 pr-0">
    入力する歌詞
  </div>
  <div class="col-10 pl-0">
    <textarea rows="5" id="lal-lyrics-textarea" class="w-100" style="background-color: #0003; color: #fff;"></textarea>
  </div>
</div>
<div class="row ml-2 w-100">
  <div class="col-2"></div>
  <div class="col-2 p-0">
    自動変換
  </div>
  <div class="col-5 p-0" id="lal-conversion_mode">
    <label class="mr-3">
      <input type="radio" name="lal_conversion_mode" value="" style="vertical-align: -2px;" class="mr-1">なし
    </label>
    <label class="mr-3">
      <input type="radio" name="lal_conversion_mode" value="kakasi" checked style="vertical-align: -2px;" class="mr-1">かな
    </label>
    <label>
      <input type="radio" name="lal_conversion_mode" value="kakasi_en" style="vertical-align: -2px;" class="mr-1">英語
    </label>
  </div>
  <div class="col-3 text-right">
    <div class="btn btn-outline-danger m-0" id="lal-execute-button">
      <span style="font-size:small">自動入力開始</span>
    </div>
  </div>
</div>
`.replace(/\n\s*/g, ''));
    document.getElementById('lal-add-empty-line-button').onclick = addEmptyLine;
    document.getElementById('lal-next-line-button').onclick = loadLine;
    lyricsTextarea = document.getElementById('lal-lyrics-textarea');
    lyricsTextarea.onchange = setLineTextArray;
    document.getElementById('lal-conversion_mode').onchange = onConversionModeChange;
    document.getElementById('lal-execute-button').onclick = onExecuteButtonClick;
  }

  window.command_add = new Proxy(command_add, {apply(_command_add) {
    const lyricsArrayCopy = lyrics_array.slice();

    _command_add();
    reset_color_line();

    const addedLineIndex = lyrics_array.findIndex(l => !lyricsArrayCopy.includes(l));
    if (addedLineIndex > -1) scrollToLine(addedLineIndex);

    if (!isAutoloaderEnabled || wordsInput.value) return;
    if (lineTextArray.length) loadLine();
    else setAutoloader(false);
  }});

  addAutoloaderElements();

})();