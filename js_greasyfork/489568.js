// ==UserScript==
// @name         Key media control for niconico
// @namespace    https://htsign.hateblo.jp
// @version      0.9.6
// @description  ニコニコ動画本体側でいろいろ便利になった結果、今は音量を表示させる機能と次の動画を自動再生させない機能のみ
// @author       htsign
// @match        https://www.nicovideo.jp/watch/*
// @match        https://live.nicovideo.jp/watch/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/489568/Key%20media%20control%20for%20niconico.user.js
// @updateURL https://update.greasyfork.org/scripts/489568/Key%20media%20control%20for%20niconico.meta.js
// ==/UserScript==

(() => {
  'use strict';

  /** @type {function(string): HTMLElement | null} */
  const $ = Document.prototype.querySelector.bind(document);

  const getVolumeBar = () => $('[aria-label="volume"]');

  {
    const TEXT_CLASS = 'volumeText';

    /**
     * @param {HTMLElement} volumeBar
     * @returns {void}
     */
    const showVolume = volumeBar => {
      /** @type {[, string | number | undefined]} */
      let [, volume] = volumeBar.style.transform.match(/scaleX\(([^\)]+?)\)/) ?? [];

      let volumeElement = $(`.${TEXT_CLASS}`);
      if (volumeElement == null) {
        const attributes = {
          className: TEXT_CLASS,
          style: `
            position: absolute;
            left: calc(var(--sizes-x10) + 10px);
            transform: translateY(-.5rem);
            width: max-content;
          `,
        };
        volumeElement = Object.assign(document.createElement('output'), attributes);
      }

      const container = volumeBar.parentElement;
      if (volume != null) {
        container.append(Object.assign(volumeElement, { textContent: `${(volume * 100).toFixed()} %` }));
      }
      else if (!Number.isNaN(volume = parseInt(volumeBar.style.marginLeft))) {
        volumeElement.style.lineHeight = 2.5;
        container.append(Object.assign(volumeElement, { textContent: `${volume.toFixed()} %` }));
      }
    };

    const main = () => {
      const volumeBar = getVolumeBar();
      if (volumeBar == null) return requestAnimationFrame(main);

      const observer = new MutationObserver(records => {
        records
          .map(record => record.target)
          .forEach(showVolume);
      });
      observer.observe(volumeBar, { attributeFilter: ['style'] });

      showVolume(volumeBar);
    };
    main();
  }

  // 次の動画を自動再生させない
  {
    const f = () => {
      const nextVideoConfirmationCancel = document.querySelector('[data-element-name="next_video_confirmation_cancel"]');
      nextVideoConfirmationCancel?.click();
      requestAnimationFrame(f);
    };
    f();
  }
})();
