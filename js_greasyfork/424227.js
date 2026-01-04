// ==UserScript==
// @name          2ch.hk: замена превью пикч на полный файл
// @description   Плюсы: качественные превью, наглядные гифки. Минусы: интернет-трафик и ОЗУ
// @author        Konf
// @namespace     https://greasyfork.org/users/424058
// @icon          https://www.google.com/s2/favicons?domain=2ch.hk&sz=32
// @version       1.0.1
// @include       /^https:\/\/2ch\.(hk|pm)\/(\w|\d)+((|\/)$|\/(index|(res|arch)\/).*\.html($|\?.*))/
// @compatible    Chrome
// @compatible    Opera
// @compatible    Firefox
// @run-at        document-idle
// @require       https://cdnjs.cloudflare.com/ajax/libs/arrive/2.4.1/arrive.min.js
// @grant         GM_registerMenuCommand
// @grant         GM_getValue
// @grant         GM_setValue
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/424227/2chhk%3A%20%D0%B7%D0%B0%D0%BC%D0%B5%D0%BD%D0%B0%20%D0%BF%D1%80%D0%B5%D0%B2%D1%8C%D1%8E%20%D0%BF%D0%B8%D0%BA%D1%87%20%D0%BD%D0%B0%20%D0%BF%D0%BE%D0%BB%D0%BD%D1%8B%D0%B9%20%D1%84%D0%B0%D0%B9%D0%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/424227/2chhk%3A%20%D0%B7%D0%B0%D0%BC%D0%B5%D0%BD%D0%B0%20%D0%BF%D1%80%D0%B5%D0%B2%D1%8C%D1%8E%20%D0%BF%D0%B8%D0%BA%D1%87%20%D0%BD%D0%B0%20%D0%BF%D0%BE%D0%BB%D0%BD%D1%8B%D0%B9%20%D1%84%D0%B0%D0%B9%D0%BB.meta.js
// ==/UserScript==

/**
 * Что нового:
 * 1.0.1 - Исправлен баг замены файлов
 *   у всплывающих ответов в архивных тредах
 */

/* jshint esversion: 6 */

(function() {
  'use strict';

  // settings
  const replaceSubs = {
    jpg: GM_getValue('jpg', true),
    png: GM_getValue('png', true),
    gif: GM_getValue('gif', true)
  };

  GM_registerMenuCommand('Настроить', setup);
  
  function setup(isFirstRun) {
    if (isFirstRun) {
      alert(
        GM_info.script.name + '\n\n' +
        'Это первая настройка. Скрипт задаст ' +
        'несколько неудобных вопросов'
      );
    }

    for (const type in replaceSubs) {
      const newState = confirm(
        'Включить замену для ' + type + '? ' +
        (type === 'jpg' || type === 'png' ? 'Не ' + 
        'рекомендуется при плохом интернете. ' : '') +
        'Сейчас замена для этого типа ' +
        (replaceSubs[type] ? 'включена' : 'выключена')
      );

      replaceSubs[type] = newState;
      GM_setValue(type, newState);
    }
    
    if (isFirstRun) {
      alert(
        'Готово! Изменения будут применены к новым ' +
        'постам.\nЧтобы вызвать настройку ещё раз, ' +
        'нажми на иконку своего менеджера скриптов ' +
        'и выбери подпункт настройки этого скрипта'
      );
    }
  }

  if (!GM_getValue('notFirstRun')) {
    setup(true);
    GM_setValue('notFirstRun', true);
  }
  
  const tempGlobalVar = window[Math.random()] = {};
  const path = location.pathname;
  const archiveMarks = path.split('/').splice(2, 2);
  const dt = { jpg: '1', png: '2', gif: '4' };
  const q = 'a.post__image-link > img';

  document.arrive(q, { existing: true }, (postImgNode) => {
    const postImgData = postImgNode.dataset;

    if (
      !postImgData.src
      ||
      !(replaceSubs.jpg && postImgData.type === dt.jpg)
      &&
      !(replaceSubs.png && postImgData.type === dt.png)
      &&
      !(replaceSubs.gif && postImgData.type === dt.gif)
    ) return;

    const id = Math.random();
    const tempImg = new Image;

    // this prevents the image from destroying after
    // the function is executed. not sure it is needed
    tempGlobalVar[id] = tempImg;

    if (archiveMarks[0] === 'arch') {
      const archPathPart = archiveMarks.join('/');
      const newPath = postImgData.src.split('/');
      const insertPos = newPath.indexOf('src');

      if (insertPos === -1) throw new Error(
        'Something went wrong'
      );

      newPath.splice(insertPos, 0, archPathPart);

      // to avoid slow redirects...
      const directImgLink = newPath.join('/');

      tempImg.src = postImgData.src = directImgLink;
    } else {
      tempImg.src = postImgData.src;
    }

    tempImg.onload = function() {
      // replace a preview with a cached full file
      postImgNode.src = tempImg.src;

      // clean up memory
      delete tempGlobalVar[id];
    };

    tempImg.onerror = function() {
      delete tempGlobalVar[id];
    };
  });
})();
