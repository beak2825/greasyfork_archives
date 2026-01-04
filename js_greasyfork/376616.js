// ==UserScript==
// @name fか[で全画面化
// @description Firefoxで全画面化のアラートを消すにはabout:config→full-screen-api.warning.timeout→-1
// @match *://*/*
// @grant none
// @version 0.1.2
// @namespace https://greasyfork.org/users/181558
// @downloadURL https://update.greasyfork.org/scripts/376616/f%E3%81%8B%5B%E3%81%A7%E5%85%A8%E7%94%BB%E9%9D%A2%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/376616/f%E3%81%8B%5B%E3%81%A7%E5%85%A8%E7%94%BB%E9%9D%A2%E5%8C%96.meta.js
// ==/UserScript==

(function() {
  document.addEventListener('keydown', function(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable || ((e.target.closest('#chat-messages,ytd-comments-header-renderer') || document.activeElement.closest('#chat-messages,ytd-comments-header-renderer')))) return;
    if (/www\.youtube\.com\/watch/.test(location.href) && e.key === "[") return;
    if (!e.getModifierState("Alt") && !e.getModifierState("Control") && !e.getModifierState("Shift") && (e.key === "f" || e.key === "[")) { // f [ 全画面化

      toggleFullScreen();
      return false;

      function toggleFullScreen() {
        if (!document.fullscreenElement) {
          let p = document.documentElement.requestFullscreen();
          p.catch(() => {});
        } else {
          if (document.exitFullscreen) {
            let p = document.exitFullscreen();
            p.catch(() => {});
          }
        }
      }
    }
  }, false);
})();
