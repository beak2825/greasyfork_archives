// ==UserScript==
// @name          Ruby reference manaul version switcher
// @name:ja      るりまバージョンスイッチャー for Rubyリファレンスマニュアル
// @namespace     https://greasyfork.org/ja/users/570127
// @version       2025.12.20.0
// @description    Switch version of Ruby reference manual by key shortcut
// @description:ja  るりまのバージョンをキーボードのショートカットで切り替えます
// @author        universato
// @match         https://docs.ruby-lang.org/ja/*/*.html
// @match         https://docs.ruby-lang.org/en/*/*.html
// @icon          https://www.google.com/s2/favicons?sz=64&domain=ruby-lang.org
// @license       MIT
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/500677/%E3%82%8B%E3%82%8A%E3%81%BE%E3%83%90%E3%83%BC%E3%82%B8%E3%83%A7%E3%83%B3%E3%82%B9%E3%82%A4%E3%83%83%E3%83%81%E3%83%A3%E3%83%BC%20for%20Ruby%E3%83%AA%E3%83%95%E3%82%A1%E3%83%AC%E3%83%B3%E3%82%B9%E3%83%9E%E3%83%8B%E3%83%A5%E3%82%A2%E3%83%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/500677/%E3%82%8B%E3%82%8A%E3%81%BE%E3%83%90%E3%83%BC%E3%82%B8%E3%83%A7%E3%83%B3%E3%82%B9%E3%82%A4%E3%83%83%E3%83%81%E3%83%A3%E3%83%BC%20for%20Ruby%E3%83%AA%E3%83%95%E3%82%A1%E3%83%AC%E3%83%B3%E3%82%B9%E3%83%9E%E3%83%8B%E3%83%A5%E3%82%A2%E3%83%AB.meta.js
// ==/UserScript==

// en: master, 2.0.0 ~ 2.7.0, 3.0 ~
// ja: en + latest, 1.8.7, 1.9.3

// '1.9' -> '1.9.3'
// '2.6' -> '2.6.0'
// '3.1' -> '3.1'
function ruremaVersion(version){
    if(version.match(/1\.[0-8]/)){ return '1.8.7'; }
    else if(version === '1.9'){ return '1.9.3'; }
    else if(version.match(/2\.[0-7]/)){ return version + '.0'; }
    else if(version.match(/2\.[7-9]/)){ return '2.7.0'; } // Ruby 2.7 is the last 2.x version.
    else if(version.match(/3\.[0-5]/)){ return version; }
    else{ return 'master'; }
}

// Reference table for Ruby versions (not used directly)
const RUREMA_VERSIONS = {
    1.8: '1.8.7',
    1.9: '1.9.7',
    2.0: '2.0.0',
    2.1: '2.1.0',
    2.2: '2.2.0',
    2.3: '2.3.0',
    2.4: '2.4.0',
    2.5: '2.5.0',
    2.6: '2.6.0',
    2.7: '2.7.0',
    2.8: '2.7.0',
    2.9: '2.7.0',
    3.0: '3.0',
    3.1: '3.1',
    3.2: '3.2',
    3.3: '3.3',
    3.4: '3.4',
    3.5: '3.5',
};

// Shortcuts to switch version by numeric key
(function() {
  let keyInput = "";

  document.addEventListener('keydown', function (event) {
      const activeTagName = document.activeElement.tagName;
      const inTextarea = ['TEXTAREA', 'INPUT'].includes(activeTagName);
      const invalidInput = event.key.match(/[^0-9.lm]/);

      // テキストエリア内の入力、数字・ドット以外の入力であれば、終了。
      if(inTextarea || invalidInput){
          keyInput = '';
          return;
      }

      if(event.ctrlKey || event.metaKey){ return; }

      // 入力はいったん最後の3文字以内にする
      keyInput = (keyInput + event.key).slice(-3);

      // この時点で、入力は2文字か3文字。
      // 最後の入力(末尾2桁)が数字なら、ドット付きのマイナーバージョンまでの形にする。
      if(keyInput.match(/[0-9][0-9]$/)){
          const n = keyInput.length;
          keyInput = keyInput[n - 2] + '.' + keyInput[n - 1];
      }

      console.log(`[version switcher]: ${keyInput}`);

      const paths = location.pathname.split('/');
      const language = paths[1];
      const currentVersion = paths[2];

      // バージョンを期待するところ、数字・ドット以外の文字があれば終了する。
      // Expect version segment: master | latest | x.y(.z)
      if(currentVersion === 'master'){}
      else if(currentVersion === 'latest'){}
      else if(currentVersion.match(/[1-9]\.[0-9](\.[0-9])?/)){}
      else{
          console.log("[version switcher] not version url");
          keyInput = '';
          return;
      }

      // 英語版ドキュメントはversion 1.xがなさそうなので、終了する。
      if(language === 'en' && keyInput.match(/1\.[0-9]/)){
          console.log("[version switcher] en don't support 1.x ");
          return;
      }

      // 1.0 ~ 4.9のときに限り、バージョンを変更する。
      let newVersion;
      if(keyInput.match(/[1-4]\.[0-9]/)){
          newVersion = ruremaVersion(keyInput);
      }else if(event.key === 'l' && language === 'ja'){
          newVersion = 'latest';
      }else if(event.key === 'm'){
          newVersion = 'master';
      }

      if(newVersion){
          location.href = location.href.replace(currentVersion, newVersion);
      }

  }, false);
})();
