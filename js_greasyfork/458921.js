// ==UserScript==
// @name         Futbin Remove Ads
// @namespace    https://www.iplaysoft.com
// @version      0.7
// @description  Futbin Remove Ads!
// @author       X-Force
// @match        https://www.futbin.com/*
// @match        https://www.futwiz.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=futbin.com
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/458921/Futbin%20Remove%20Ads.user.js
// @updateURL https://update.greasyfork.org/scripts/458921/Futbin%20Remove%20Ads.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if(window.location.host=="www.futbin.com"){
        GM_addStyle ( `
        #venatus-video-container,.sci-topbanner {display:none !important;}
    .vm-placement,.web-accessibility-menu,#av-container,.av-desktop {display:none !important;}
    .player-header-video-ad,.avp-in-read,.trc_related_container,.ad-container,.tf-v1-sidetab,.jpx-pu-wrapper,.jpx-pu-container {display:none !important;}
` );
    }

    if(window.location.host=="www.futwiz.com"){
        GM_addStyle ( `
    .ad,#nn_primis_player,#nn_mpu1 {display:none !important;}
` );
       /* var frames = document.getElementsByTagName('iframe');
        for (var i in frames){
             console.log(frames[i].src);
            var frmSrc=frames[i].src+"";
            var frmId=frames[i].id;
            if (frmSrc.includes("google")|| frmSrc.includes("ads")){

                document.body.removeChild(frames[i]);
            }
        }
        */
    }
})();