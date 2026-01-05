// ==UserScript==
// @name         Blomaga Image Paste
// @namespace    https://github.com/segabito/
// @version      0.0.5
// @description  ブロマガにクリップボードから画像アップロード
// @author       segabito macmoto
// @match        *://ch.nicovideo.jp/tool/blomaga/edit?article_id=*
// @match        *://ch.nicovideo.jp/tool/blomaga/edit
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/lodash.js/3.10.1/lodash.js
// @license      public domain
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/22981/Blomaga%20Image%20Paste.user.js
// @updateURL https://update.greasyfork.org/scripts/22981/Blomaga%20Image%20Paste.meta.js
// ==/UserScript==

(function() {
  const monkey = function() {
    const $ = window.jQuery;
    const Blomaga = window.Blomaga;
    const Editor = Blomaga.Editor;

    const post = function(file) {
      const transfer = new Blomaga.EditorUploader.FileReadTransfer();
      const progressBar = new Blomaga.EditorUploader.ProgressBar();
      progressBar.setPercent(0);
      transfer.progress_bar = progressBar;
      progressBar.show();

      transfer.onProgress = (per) => {
        progressBar.setPercent(per);
      };

      transfer.onLoad = (resp) => {
        console.info('success: ', resp);
        progressBar.setPercent(100);
        progressBar.showSuccess();
        window.setTimeout(() => { progressBar.hide(); }, 1000);

        Blomaga.EditorSideBar.Image.addList(
          resp.src,
          resp.image_id,
          resp.width,
          resp.height,
          resp.csrf_token,
          resp.csrf_token_time
        );
        Editor.insertUploadImage(
          resp.image_id,
          resp.src,
          resp.width,
          resp.height
        );
      };

      transfer.onError = (json) => {
        progressBar.showError(json);
      };

      transfer.upload(file);
    };

    const onPaste = function(e) {
      let file;
      const items =
        (e.clipboardData || e.originalEvent.clipboardData).items;
      console.info('clipboard items', e, JSON.stringify(items));

      for (let i = 0, len = items.length; i < len; i++) {
        let item = items[i];
        if (item.type.match(/^image/i)) {
          file = item.getAsFile();
          break;
        }
      }
      if (!file) { return; }
      e.preventDefault();
      e.stopPropagation();
      post(file);
    };

    const initialize = function() {
      Editor.insertUploadImage =
        _.debounce(Editor.insertUploadImage.bind(Editor), 300);

      window.setTimeout(() => {
        $('iframe#wysiwyg_editor_ifr')
          .contents().find('html').on('paste', onPaste);
      }, 1000);
    };
    initialize();
  };


  const script = document.createElement('script');
  script.setAttribute('type', 'text/javascript');
  script.setAttribute('charset', 'UTF-8');
  script.appendChild(document.createTextNode('(' + monkey + ')()'));
  document.body.appendChild(script);
})();
