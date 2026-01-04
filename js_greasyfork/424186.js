// ==UserScript==
// @name Ability Viewer
// @namespace abilityViewer
// @match http://game.granbluefantasy.jp/
// @grant none
// @description ability viewer
// @version 1.0.0
// @downloadURL https://update.greasyfork.org/scripts/424186/Ability%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/424186/Ability%20Viewer.meta.js
// ==/UserScript==

window.addEventListener('load', async () => {
  const abilityPopup = document.createElement('div');
  abilityPopup.style.position = 'fixed';
  abilityPopup.style.zIndex = '9999';
  abilityPopup.style.color = '#ffffff';
  abilityPopup.style.border = '2px solid #639fa8';
  abilityPopup.style.borderRadius = '5px';
  abilityPopup.style.padding = '10px';
  abilityPopup.style.paddingTop = '-80px';
  abilityPopup.style.boxShadow = 'inset 0 0 6px 1px rgba(99,159,168,0.5)';
  abilityPopup.style.background = `url('http://game-a.granbluefantasy.jp/assets/img_mid/sp/raid/footer_bg.png?1524096000') repeat-x`;
  abilityPopup.style.backgroundPosition = '0px -100px';
  abilityPopup.style.maxWidth = '400px';
  setInterval(() => {
    const abilityElements = Array.from(document.querySelectorAll('.btn-ability-available > div, .btn-ability-unavailable > div')).filter(e => e.attributes['ability-name']);
    for (const element of abilityElements) {
      if (!element.attributes['popup']) {
        element.attributes['popup'] = true;
        element.parentElement.addEventListener('mouseenter', event => {
          abilityPopup.innerHTML = `<span style="font-size: 16px;">${element?.attributes['ability-name']?.textContent}</span><br />${element?.attributes['text-data']?.textContent}`;
          document.body.appendChild(abilityPopup);
        });
        element.parentElement.addEventListener('mousemove', event => {
          abilityPopup.style.left = `${event.pageX + 5}px`;
          abilityPopup.style.top = `${event.pageY + 15}px`;
        });
        element.parentElement.addEventListener('mouseleave', () => abilityPopup.parentElement.removeChild(abilityPopup));
      }
    }
  }, 1000);
});
