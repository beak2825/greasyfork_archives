// ==UserScript==
// @name            hypothesis 2
// @version         1
// @author          blankmann
// @description     Inject hypoth.is on all sites
// @namespace       https://greasyfork.org/users/542418
 
// @grant    				none
// @noframes
// @license         Apache License V2
// @match           *://*/*
// @downloadURL https://update.greasyfork.org/scripts/419730/hypothesis%202.user.js
// @updateURL https://update.greasyfork.org/scripts/419730/hypothesis%202.meta.js
// ==/UserScript==
 
/**
 * Repo: https://github.com/tim-hub/Hypothesis-Assistant
 */
(
  function(){
    window.hypothesisConfig=function(){
      return{showHighlights:true,appType:'bookmarklet'};
    };
    var d=document;
    var s=d.createElement('script');
    s.setAttribute('src','https://hypothes.is/embed.js');
    d.body.appendChild(s);
  }
)();