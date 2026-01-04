// ==UserScript==
// @name        fidelity_history_expander
// @namespace   https://github.com/jmegner
// @version     0.1
// @description automatically expands history section of 'Activity & Orders' tab
// @license     Unlicense
// @homepageURL https://github.com/jmegner/greasemonkey_fidelity_history_expander
// @supportURL  https://github.com/jmegner/greasemonkey_fidelity_history_expander/issues
// @match       https://oltx.fidelity.com/ftgw/fbc/oftop/portfolio
// @grant       none
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/382264/fidelity_history_expander.user.js
// @updateURL https://update.greasyfork.org/scripts/382264/fidelity_history_expander.meta.js
// ==/UserScript==

"use strict";
console.debug("jme main begin " + document.location);

checkForHistoryExpander("not through MutationObserver");

(new MutationObserver(makeLogWrappedCallback(checkForHistoryExpander))).observe(
  document,
  {childList: true, subtree: true});


function execLogWrappedFunc(funcToWrap, ...funcArgs)
{
  try
  {
    return funcToWrap(...funcArgs);
  }
  catch(err)
  {
    console.error(err);
    throw err;
  }
}

function makeLogWrappedCallback(funcToWrap)
{
  return function(...funcArgs) { return execLogWrappedFunc(funcToWrap, ...funcArgs); };
}

function checkForHistoryExpander(changes, observer)
{
  //console.debug("jme checkForHistoryExpander begin");
  let historyExpanderContent = document.querySelector("#historyExpanderContent");
  //console.debug("historyExpanderContent", historyExpanderContent);

  if(historyExpanderContent && !historyExpanderContent.classList.contains("expandeded"))
  {
    let historyExpanderArea = document.querySelector(".activity--expander-history");
    //console.debug("historyExpanderArea", historyExpanderArea);
    //console.debug("historyExpanderContent", historyExpanderContent);

    let elemsToModify = [historyExpanderArea, historyExpanderContent];
    elemsToModify.forEach(elem =>
    {
      elem.classList.remove("collapsed");
      elem.classList.add("expanded");
    });

    //console.debug("jme relevant mutation list", changes);
  }

}

