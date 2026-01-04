// ==UserScript==
// @name         Halloween QoL
// @namespace    https://greasyfork.org/zh-CN/users/164491-mirrorcubesquare
// @version      0.1
// @description  add cancel buttoms for queues
// @author       MCS
// @match        http://www.mousehuntgame.com/*
// @match        https://www.mousehuntgame.com/*
// @icon         https://www.google.com/s2/favicons?domain=mousehuntgame.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433876/Halloween%20QoL.user.js
// @updateURL https://update.greasyfork.org/scripts/433876/Halloween%20QoL.meta.js
// ==/UserScript==
function generateNode(slot,cauldron)
{
    var node=document.createElement('a');
    node.href="#";
    node.className='halloweenBoilingCauldronRecipeView-cauldron-queueSlot-cancelButton MCS-Placeholder';
    node.onclick=function(){hg.views.HeadsUpDisplayHalloweenBoilingCauldronView.removeFromQueue(this);return false;}
    node.setAttribute('data-cauldron-index',cauldron);
    node.setAttribute('data-queue-slot',slot);
    return node;
}
function refreshNode()
{
        /*document
      .querySelectorAll(".MCS-Placeholder")
      .forEach(el => el.remove());*/
    document.querySelectorAll(".halloweenBoilingCauldronHUD-cauldron-queue").forEach(item=>{
        item.insertBefore(generateNode(item.getAttribute('data-queue-slot'),item.getAttribute('data-cauldron-index')),item.firstChild);
    });
}
(function() {
    'use strict';
    refreshNode();
    // Your code here...
})();