// ==UserScript==
// @name        hdvietnam.com - Thanks Auto-reloading
// @namespace   Violentmonkey Scripts
// @match       https://hdvietnam.com/threads/*
// @grant       none
// @version     1.0
// @author      ReeganExE (Ninh Pham)
// @description Tự động "hiển linh" khi bấm "Cảm ơn"
// @downloadURL https://update.greasyfork.org/scripts/431154/hdvietnamcom%20-%20Thanks%20Auto-reloading.user.js
// @updateURL https://update.greasyfork.org/scripts/431154/hdvietnamcom%20-%20Thanks%20Auto-reloading.meta.js
// ==/UserScript==

jQuery(() => {
  jQuery('.LikeLink.like').click((e) => {
    const pid = e.currentTarget.dataset.container.replace('#likes-post-', '');
    jQuery(document).one('XFAjaxSuccess', (e) => {
      if (e.textStatus === 'success') {
        fetch(`https://hdvietnam.com/posts/${pid}`)
          .then((a) => a.text())
          .then((t) => {
            const a = new DOMParser().parseFromString(t, 'text/html');
            const s = `post-${pid}`;
            const el = document.getElementById(s);
            el.innerHTML = a.getElementById(s).innerHTML;
            XenForo.activate(el);
          });
      }
    });
  });
})