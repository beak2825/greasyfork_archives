// ==UserScript==
// @name         Lzt block alert
// @namespace    lztblock
// @version      1.0
// @description  bomba
// @author       openresty
// @match        https://zelenka.guru/*
 // @license MIT
// @downloadURL https://update.greasyfork.org/scripts/470541/Lzt%20block%20alert.user.js
// @updateURL https://update.greasyfork.org/scripts/470541/Lzt%20block%20alert.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (document.URL == "https://zelenka.guru/public/pm2.wav") {
           document.body.innerHTML =`
          <div>
             fuck
          </div>
    `;
    }

      setInterval(() => {
          if(document.getElementById("StackAlerts")){
            document.getElementById("StackAlerts").remove();
          }
        }, 100);
})();