// ==UserScript==
// @name			★Moomoo.io FPS Counter! 2021
// @version			1.0
// @description		FPS Counter (Not Display)!
// @author			xPlasmicc
// @match			*://moomoo.io/*
// @grant			none
// @namespace       https://greasyfork.org/en/users/855407-xplasmicc
// @license         none
// @downloadURL https://update.greasyfork.org/scripts/437869/%E2%98%85Moomooio%20FPS%20Counter%21%202021.user.js
// @updateURL https://update.greasyfork.org/scripts/437869/%E2%98%85Moomooio%20FPS%20Counter%21%202021.meta.js
// ==/UserScript==
       
       var times = [], FPS;

       function refreshLoop() {
           window.requestAnimationFrame(() => {
               const now = performance.now();
               while (times.length > 0 && times[0] <= now - 1000) times.shift();
               times.push(now);
               FPS = times.length;
               refreshLoop();
           });
       }
       refreshLoop();