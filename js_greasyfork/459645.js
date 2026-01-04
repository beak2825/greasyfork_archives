// ==UserScript==
// @name          Selective removal of music
// @description   Скрипт добавляет возможность выборочного удаления сохраненной музыки из ВКонтакте.
// @match         https://vk.com/audios*
// @version       1.0
// @namespace     https://greasyfork.org/users/1023602
// @downloadURL https://update.greasyfork.org/scripts/459645/Selective%20removal%20of%20music.user.js
// @updateURL https://update.greasyfork.org/scripts/459645/Selective%20removal%20of%20music.meta.js
// ==/UserScript==


window.onload = () => {
   document.querySelectorAll('.CatalogBlock__my_audios .audio_row').forEach(audio => {
      const deleteInput = document.createElement('input');
      audio.style.marginLeft = '43px';
      audio.before(deleteInput);
      deleteInput.type = 'checkbox';
      deleteInput.style.position = 'absolute';
      deleteInput.style.top = `${audio.offsetTop+22}px`;
      deleteInput.style.left = `${audio.offsetLeft-28}px`;
      deleteInput.style.margin = '0';
   })
}