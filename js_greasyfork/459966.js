// ==UserScript==
// @name         Portainer Interface Helper
// @namespace    portainer
// @version      1.0.1
// @description  Remove the banner advertising Portainer Business
// @author       MENTAL
// @include      https://portainer.yourdomain.xyz/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=https://www.portainer.io/
// @downloadURL https://update.greasyfork.org/scripts/459966/Portainer%20Interface%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/459966/Portainer%20Interface%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(window).load(function(){
        setTimeout(function(){
        $('sidebar button.border-0.bg-warning-5.text-warning-9.w-full.py-2.font-semibold.flex.justify-center.items-center.gap-3').css("display","none");
        },1000);
    })
})();