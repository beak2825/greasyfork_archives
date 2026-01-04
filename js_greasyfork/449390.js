// ==UserScript==
// @name         RED: Avatar Lightbox
// @version      0.3
// @description  Replace avatar link on profile page with a lightbox
// @author       mrpoot
// @match        https://redacted.sh/user.php?id=*
// @grant        none
// @run-at       document-end
// @namespace https://greasyfork.org/users/148773
// @downloadURL https://update.greasyfork.org/scripts/449390/RED%3A%20Avatar%20Lightbox.user.js
// @updateURL https://update.greasyfork.org/scripts/449390/RED%3A%20Avatar%20Lightbox.meta.js
// ==/UserScript==

(() => {
  const profileLink = document.querySelector('.sidebar a[href^="/user.php?id="]');

  const avatar = document.querySelector('.sidebar img[alt*="avatar"]');

  if (!avatar) {
    return;
  }

  if (profileLink && profileLink.contains(avatar)) {
    profileLink.parentNode.insertBefore(avatar, profileLink);
    profileLink.parentNode.removeChild(profileLink);
  }

  avatar.addEventListener('click', () => {
    window.lightbox?.init?.(avatar, avatar.width);
  }, { passive: true });
})();
