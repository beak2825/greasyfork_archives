// ==UserScript==
// @name         YouTube Subtitles Importer [Typing Tube]
// @namespace    https://greasyfork.org/users/500559
// @version      0.3
// @description  Typing Tubeのタイピングデータの作成時にYouTubeの動画に字幕があれば取り込めるようにする
// @author       ஐ
// @match        https://typing-tube.net/movie/edit?videoid=*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/400372/YouTube%20Subtitles%20Importer%20%5BTyping%20Tube%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/400372/YouTube%20Subtitles%20Importer%20%5BTyping%20Tube%5D.meta.js
// ==/UserScript==

(function userscript() {
  'use strict';
  if (typeof unsafeWindow === 'object' && unsafeWindow !== window) return window.eval(`(${userscript.toString()})();`);


  const minEmptyLineSeconds = 2;


  async function convert(conversionMode, textList, authenticity_token) {
    if (!conversionMode || !textList.length) return [];
    if (!authenticity_token) authenticity_token = window['command_' + conversionMode].toString().match(/'authenticity_token' : '([^']+)'/)[1]
    try {
      const s = textList.map(text => text.replace(/\s+/g, ' ')).join('\t');
      return (await $.post('/api/' + conversionMode, {s, authenticity_token})).split('\t').map(text => text.trim().replace(/\s\s+/g, ' '));
    } catch(e) {
      if (textList.length > 1) {
        const kanaList = [];
        for (const text of textList) kanaList.push((await convert(conversionMode, [text], authenticity_token))[0]);
        return kanaList;
      }
      console.log("kanaの作成に失敗しました");
    }
    return [''];
  }

  async function importFromYouTubeSubtitles(lang, name, conversionMode) {
    try {
      const timedTextData = await $.getJSON(`https://www.youtube.com/api/timedtext?v=${player.getVideoData().video_id}&lang=${lang}&name=${name ? encodeURIComponent(name) : ''}&fmt=json3`),
            captionList = timedTextData.events.map(e => ({startSec: e.tStartMs / 1000,
                                                          endSec: (e.tStartMs + e.dDurationMs) / 1000,
                                                          text: e.segs.map(e => e.utf8).join(' ').replace(/\u200B/g, '').trim()
                                                         })).filter(e => e.text).sort((a, b) => a.startSec - b.startSec),
            duration = player.getDuration(),
            kanaList = await convert(conversionMode, captionList.map(({text}) => text)),
            _lyrics_array = [];
      _lyrics_array.push(['0', '', '']);
      for (const [i, {startSec, endSec, text}] of captionList.entries()) {
        const nextSec = captionList[i + 1] && captionList[i + 1].startSec || duration,
              kana = kanaList[i] || '';
        _lyrics_array.push([startSec.toFixed(2), text, kana]);
        if (nextSec - endSec >= minEmptyLineSeconds) _lyrics_array.push([endSec.toFixed(2), '', '']);
      }
      _lyrics_array.push([duration.toFixed(2), 'end', '']);
      window.lyrics_array = _lyrics_array;
      update_subtitles_table();
    } catch(e) {
      alert('字幕の取り込みに失敗しました。');
    }
  }

  function onLangSelectChange() {
    player.setOption('captions', 'track', {languageCode: this.value});
  }

  async function onExecuteButtonClick(e) {
    e.preventDefault();
    if (this.classList.contains('disabled')) return;
    this.classList.add('disabled');
    this.firstElementChild.textContent = '実行中';
    const selectedOpt = document.getElementById('ytsi-lang-select').selectedOptions[0],
          lang = selectedOpt.value,
          name = selectedOpt.text.split(/^.+? - /)[1],
          conversionMode = document.querySelector('#ytsi-conversion-mode :checked').value;
    await importFromYouTubeSubtitles(lang, name, conversionMode);
    this.classList.remove('disabled');
    this.firstElementChild.textContent = '実行';
  }

  function addImporterElements() {
    document.getElementById('setting').insertAdjacentHTML('beforeend', `
<div class="row ml-2 w-100">
  <div class="col-12">
    歌詞を全て空にしてYouTubeの字幕から歌詞をコピーできます
  </div>
</div>
<div class="row ml-2 w-100">
  <div class="col-1 pr-0">
    言語
  </div>
  <div class="col-4 p-0">
    <select name="ytsi_lang" id="ytsi-lang-select" class="mw-100"></select>
  </div>
  <div class="col-1 p-0">
    変換
  </div>
  <div class="col-4 p-0" id="ytsi-conversion-mode">
    <label class="mr-3">
      <input type="radio" name="ytsi_conversion_mode" value="" checked style="vertical-align: -2px;" class="mr-1">なし
    </label>
    <label class="mr-3">
      <input type="radio" name="ytsi_conversion_mode" value="kakasi" style="vertical-align: -2px;" class="mr-1">かな
    </label>
    <label>
      <input type="radio" name="ytsi_conversion_mode" value="kakasi_en" style="vertical-align: -2px;" class="mr-1">英語
    </label>
  </div>
  <div class="col-2">
    <div class="btn btn-outline-danger m-0" id="ytsi-execute-button">
      <span style="font-size:small">実行</span>
    </div>
  </div>
</div>
`.replace(/\n\s*/g, ''));
    const trackList = player.getOption('captions', 'tracklist'),
          defaultLang = player.getOption('captions', 'track').languageCode,
          langSelect = document.getElementById('ytsi-lang-select');
    for (const {languageCode, displayName} of trackList) {
      const isDefault = languageCode === defaultLang;
      langSelect.add(new Option(displayName, languageCode, isDefault, isDefault));
    }
    langSelect.onchange = onLangSelectChange;
    document.getElementById('ytsi-execute-button').onclick = onExecuteButtonClick;
  }

  {
    let isEnabled = true;
    var onApiChange = () => {
      if (!isEnabled) return;
      if (player.getOptions().includes('captions')) {
        if (!player.getOption('captions', 'tracklist').length) {
          player.setOption('captions', 'reload', true);
          return;
        }
        addImporterElements();
      }
      isEnabled = false;
    };
  }

  {
    let isEnabled = true;
    var onPlayOnce = () => {
      if (!isEnabled) return;
      if (player.getPlayerState() === 1) {
        player.pauseVideo();
        player.seekTo(0);
        isEnabled = false;
      }
    };
  }

  window.onPlayerReady = new Proxy(onPlayerReady, {apply(_onPlayerReady) {
    player.addEventListener('onApiChange', onApiChange);
    player.addEventListener('onStateChange', onPlayOnce);
    _onPlayerReady();
    player.playVideo();
  }});

})();