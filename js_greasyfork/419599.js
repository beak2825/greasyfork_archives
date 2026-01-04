// ==UserScript==
// @name     Fix scrollbar on exploit-db
// @version  1.1
// @grant    none
// @namespace    StephenP
// @description  Fix for the scrollbar not appearing on exploit-db.
// @author       StephenP
// @match    https://www.exploit-db.com/*
// @match    https://www.exploit-db.com/
// @downloadURL https://update.greasyfork.org/scripts/419599/Fix%20scrollbar%20on%20exploit-db.user.js
// @updateURL https://update.greasyfork.org/scripts/419599/Fix%20scrollbar%20on%20exploit-db.meta.js
// ==/UserScript==
(function (){
  addScrollbar();
  const config = { attributes: true, childList: false, subtree: false };
  const callback = function(mutationsList, observer) {
    for(const mutation of mutationsList) {
      setTimeout(function(){addScrollbar()},50);//direct execution would crash Greasemonkey, IDK why
    }
  };
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, config);
})();
function addScrollbar(){
  if(document.documentElement.className.includes("perfect-scrollbar-on")){
    document.documentElement.classList.remove("perfect-scrollbar-on");
  }
}