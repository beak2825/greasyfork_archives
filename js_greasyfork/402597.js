// ==UserScript==
// @name         monitor dom change 
// @namespace    http://www.chaochaogege.com
// @version      0.1
// @description  detect mod change
// @author       You
// @grant        none
// ==/UserScript==

!function () {
  window.monitordom = function (domnode, cb,config = {childList: true}) {
    const targetNode = domnode

    // Callback function to execute when mutations are observed
    const callback = function (mutationsList, observer) {
      for (let i = 0; i < mutationsList.length; i++) {
        cb(mutationsList[i])
      }
    };

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(targetNode, config)
  }
}()