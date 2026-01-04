// ==UserScript==
// @name        Open in scihub on semantic scholar
// @namespace   Violentmonkey Scripts
// @match       https://www.semanticscholar.org/*
// @grant       none
// @version     1.0.2
// @author      -
// @run-at      document-end
// @description 2021/7/16下午3:30:58
// @downloadURL https://update.greasyfork.org/scripts/429467/Open%20in%20scihub%20on%20semantic%20scholar.user.js
// @updateURL https://update.greasyfork.org/scripts/429467/Open%20in%20scihub%20on%20semantic%20scholar.meta.js
// ==/UserScript==

(function (){
 "use strict";
  var plink_button_selector = '.button--primary';
  //var plink_button_selector = '.primary-paper-link-button';
  var proot = document.querySelector('#app');
  var addNode = function(){
    if (document.querySelectorAll(plink_button_selector).length >= 2){
      return;
    }
    var doi = document.querySelector('.doi__link').innerText;
    var scihub_url = 'https://sci-hub.mksa.top/'.concat(doi); 
    var p = document.querySelector(plink_button_selector).parentNode;
    var ps = p.cloneNode(true);
    ps.querySelector('.icon-button-text').innerText = 'View via Scihub';
    ps.querySelector('a').href = scihub_url;
    ps.querySelector('a').removeAttribute('title');
    p.parentNode.insertBefore(ps, p.nextSibling);
  };
  const observer = new MutationObserver(function (mutationsList, observer){
    observer.disconnect();
    for(const mutation of mutationsList) {
      if (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0){
        try{
          addNode();
        }
        catch (e) {};
      }
    }
    observer.observe(proot, {childList:true, subtree:true, attributes:false});
  });
  try{
  addNode();
  }
  catch (e) {};
  observer.observe(proot, {childList:true, subtree:true, attributes:false});
  //observer.observe(p.parentNode.parentNode, {childList:true, subtree:false, attributes:false});
})()