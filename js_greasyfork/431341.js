// ==UserScript==
// @name        Animelon enhanced
// @namespace   Violentmonkey Scripts
// @match       https://animelon.com/video/*
// @grant       GM_log
// @version     1.0
// @author      -
// @description 1/26/2020, 2:54:31 PM
// @require https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @require https://cdn.jsdelivr.net/npm/lodash@4.17.15/lodash.min.js
// @downloadURL https://update.greasyfork.org/scripts/431341/Animelon%20enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/431341/Animelon%20enhanced.meta.js
// ==/UserScript==
 
function waitForSelector(parentSelector, onSuccess) {
  function tryOnce(onsuccess) {
    const parent = $(parentSelector)
    if (parent.length === 0) {
      setTimeout(() => tryOnce(onsuccess), 100);
      return;
    }
    onsuccess(parent);
  }
  tryOnce(onSuccess);
}
 
const handleJapanese = function(subNode) {
  // GM_log("Got subtitle node", subNode);
  $(subNode).contents()
    .filter(function() {
      return this.nodeType === 3 && this.textContent.includes(" ");
    })
    .replaceWith(function() {
      GM_log("Found text node", this);
      const newText = `<span style="display:none" class="ignore"> </span>`;
      const newHtml = this.textContent.replace(/ /g, newText);
      return $.parseHTML(newHtml);
    });
  // const newHtml = subNode.text().replace(/ /g, "<span style=\"display:none\" class=\"ignore\"> </span>");
  // subNode.html(newHtml);
};
 
const addBlurToNode = function(node) {
  $(node).css('filter', (idx, old) => `${old} blur(${document.englishBlur})`)
};
 
document.englishBlur = '3px';
 
window.addEventListener("DOMContentLoaded", function(event) {
  waitForSelector("body", parent => {
    // waitForSelector('#libjassVideoCover', parent => {
    //   setup(parent[0]);
    // });
    const config = { attributes: false, childList: true, subtree: true };
    const callback = events => {
      events.forEach(e => {
        if (e.type !== "childList" || e.addedNodes.length === 0) {
          return
        }
        // if (!e.target.classList.contains("libjass-wrapper")) {
        //   return
        // }
        // setup(e.target)
        
        if (!e.target.classList.contains("video-relative-container")) {
          return
        }
        
        // GM_log("Stuff added to .video-relative-container container", e);
        const found = _.find(e.addedNodes, added => added.classList.contains("libjass-wrapper"));
        if (!found) {
          return
        }
        setup(found)
        // .libjass-wrapper
        
      });
    };
    const obs = new MutationObserver(callback);
    obs.observe(parent[0], config);
  });
});
 
  // do this _every time_ the URL changes
// window.addEventListener("hashchange", () => waitAndSetup());
 
const already = {};
 
function setup(parent) {
    if (parent in already) {
      already[parent].disconnect()
    }
 
    //GM_log(`waitAndSetup called`);
    // .libjass-subs
    // probably better to wait for body, signal whenever this is added to it.
  
    GM_log(`Found target element, configuring`, parent);
    
    const config = { attributes: false, childList: true, subtree: true };
    const callback = events => {
      events.forEach(e => {
        // GM_log(`Event of type ${e.type}`, e);
        
        if (e.type !== "childList") {
          return;
        }
        
        if (e.target.classList.contains('anjapanese') 
            // TODO the multiple nodes are inside this > .data-japanese > .japanese.subtitle 
            && e.addedNodes.length === 1) {
          // GM_log("Added japanese node with 1 child", e);
          const subNode = $('.japanese.subtitle', e.addedNodes[0]);
          handleJapanese(subNode);
        } else if (e.target.classList.contains('anenglish') 
            && e.addedNodes.length === 1) {
          // GM_log("Added english node with 1 child", e);
          const subNode = $('.english.subtitle', e.addedNodes[0]);
          addBlurToNode(subNode);
        } else if (e.target.classList.contains('japanese')
            && e.target.classList.contains('subtitle')
            // Prevent re-entry from handle
            && !_.some(e.addedNodes, n => n.nodeType === 1 && n.className === 'ignore')) {
          GM_log("Change", e);
          // Change MutationRecord {type: "childList", target: span.japanese.subtitle, addedNodes: NodeList(3), removedNodes: NodeList(1), previousSibling: null, …}
          // Change MutationRecord {type: "childList", target: span.japanese.subtitle, addedNodes: NodeList(1), removedNodes: NodeList(3), previousSibling: null, …}
          
          // Due to a hover, the contents have changed to highlight some specific word.
          // Have to do the work yet again.
          // TODO have to ensure we don't trigger _ourselves_ as we do this
          // handleJapanese(e.target);
        }
      });
    };
    const obs = new MutationObserver(callback);
    already[parent] = obs;
    obs.observe(parent, config);
  //})
}