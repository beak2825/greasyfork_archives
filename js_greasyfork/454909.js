// ==UserScript==
// @name        misskey input form dynamic resize
// @description well, dynamically resizes misskey post compose textarea height within certain limits
// @author      taxuswc
// @namespace   https://shitpost.poridge.club/@taxuswc
// @include     *
// @version     0.0.5
// @license     Unlicense
// @downloadURL https://update.greasyfork.org/scripts/454909/misskey%20input%20form%20dynamic%20resize.user.js
// @updateURL https://update.greasyfork.org/scripts/454909/misskey%20input%20form%20dynamic%20resize.meta.js
// ==/UserScript==


// ok lets begin with a hack, that's what js is really for
// we need to execute our textarea resizing stuff every time the model shows up.
// This is done by observing the children of #misskey_app and waiting for
//+ the element with a particular class to appear.
// But we need to wait until misskey finishes loading its webshits completely
//+ to be sure that #misskey_app is present in the DOM
document.addEventListener('readystatechange', function docStateChange() {
  if(document.readyState === 'complete') {
    document.removeEventListener('readystatechange', docStateChange);
    firestuff();
  }
});


function firestuff() {
  const misskey_app_node = document.getElementById('misskey_app');
  if (!misskey_app_node) { return; } // ok it is not misskey, aborting

  // console.log("you are fired..."); // NOT funny

  // which events to observe
  const mutation_config = { attributes: false, childList: true, subtree: true };

  // call this on every observation..
  const callback = (mutationList, observer) => {
    for (const mut of mutationList) {
      if (mut.type === 'childList') {
        mut.addedNodes.forEach( n => {
          // ok now we are warmed up, time for really HoRrIbLe hacks
          if (n.classList.contains("qzhlnise")) {
            // actual code that resizes the textarea
            const tx = document.querySelector(".gafaadew.modal textarea");
            let mh = parseFloat(getComputedStyle(tx)["min-height"]),
                Mh = parseFloat(getComputedStyle(tx)["max-height"]) || 250;
            let computeHeight = (() => {
              let sh = tx.scrollHeight,
                  nh = Math.min(Math.max(sh, mh), Mh);
              return nh;
            });

            // ensure we resize the window if there is some text already
            tx.setAttribute("style", "height:" + (computeHeight()) + "px;");
            tx.addEventListener("input", function() {
              tx.style.height = 0; // why? 'cos otherwise scrollHeight can't become smaller..
              tx.style.height = (computeHeight()) + "px";
            });
          }
        });
      }
    } // yay piramide of doom...
  };

  const observer = new MutationObserver(callback);
  observer.observe(misskey_app_node, mutation_config);
}