// ==UserScript==
// @name        StopMultipleMessageForumOnly
// @namespace   Forum
// @match       https://www.dreadcast.net/Forum*
// @match       https://www.dreadcast.net/FAQ*
// @version     1.3.4
// @author      Kmaschta, MockingJay, Pelagia
// @description Block spam on over-clicking
// @license     https://github.com/Isilin/dreadcast-scripts?tab=GPL-3.0-1-ov-file
// @require     https://update.greasyfork.org/scripts/507382/Dreadcast%20Development%20Kit.user.js
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/508039/StopMultipleMessageForumOnly.user.js
// @updateURL https://update.greasyfork.org/scripts/508039/StopMultipleMessageForumOnly.meta.js
// ==/UserScript==

(() => {
  DC.Style.apply(`#zone_reponse .bouton.poster.locked {
    background: #444;
    color: #e9e9e9; 
  }`);

  const unlock = (elem, onclick, content) => {
    elem.attr('onclick', onclick);
    elem.click(() => lock(elem));
    elem.removeAttr('style');
    elem.html(content);
    elem.removeClass('locked');
  };

  const lock = (elem) => {
    // Save event action
    var onclick = elem.attr('onclick');
    var content = elem.html();

    // Lock button
    elem.removeAttr('onclick');
    elem.unbind('click');
    elem.html('Verrouillé');
    elem.addClass('locked');

    // Still unlock after 5s
    var tid = setTimeout(() => {
      if (elem.hasClass('locked')) {
        unlock(elem, onclick, content);
        elem.unbind('dblclick');
      }
    }, 5000);

    // Unlock button on dbl click
    elem.dblclick(() => {
      clearTimeout(tid);
      unlock(elem, onclick, content);
    });
  };

  $(document).ready(() => {
    // Forum "Poster" button
    const button = $('#zone_reponse .bouton.poster').not('.locked');
    button.click(() => lock(button));
  });
})();
