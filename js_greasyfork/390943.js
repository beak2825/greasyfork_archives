// ==UserScript==
// @name Humble Bundle Auto Key Reveal
// @description Auto reveal keys for humble bundle pages
// @namespace Mattwmaster58 Scripts
// @match https://www.humblebundle.com/downloads?key=*
// @grant none
// @version 0.0.1.20191009172709
// @downloadURL https://update.greasyfork.org/scripts/390943/Humble%20Bundle%20Auto%20Key%20Reveal.user.js
// @updateURL https://update.greasyfork.org/scripts/390943/Humble%20Bundle%20Auto%20Key%20Reveal.meta.js
// ==/UserScript==

main();
function main() {
  console.log('autoreveal: running main()');
  const obsvr = new MutationObserver((event) => {
    console.log(event);
    event.forEach((record) => {
      if (record.addedNodes) {
        record.addedNodes.forEach((node) => {
          if ('querySelector' in node) {
            const keyfield_button = node.querySelector('.keyfield.enabled:not(.redeemed) .keyfield-value');
            if (keyfield_button){
              console.log(`autoreveal: keyfield button detected, clicking`);
              keyfield_button.click();
              obsvr.disconnect();
            }
          }
        });
      }
    })
  });
  const config = {attributes: true, childList: true, subtree: true};
  obsvr.observe(document.querySelector('.key-container'), config);
}