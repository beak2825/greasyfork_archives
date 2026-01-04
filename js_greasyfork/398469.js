// ==UserScript==
// @name         muahahaha youtube.com
// @namespace    muahahaha
// @version      1.2.1
// @description  fy yt white and autoplay
// @match        https://www.youtube.com/*
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/398469/muahahaha%20youtubecom.user.js
// @updateURL https://update.greasyfork.org/scripts/398469/muahahaha%20youtubecom.meta.js
// ==/UserScript==

(function() {

    'use strict';

    function main(){

        let run =
            unsafeWindow.$
            &&
            (
                location.pathname!=='/watch' || unsafeWindow.$('#toggle').length
            )
        ;

        if(run){
            console.log('muahahaha youtube.com is ON');
            unsafeWindow.$('html').attr('dark', 'true');
            unsafeWindow.$('#toggle[checked]').click();
        }
        else{
            console.log('muahahaha youtube.com is OFF');
            setTimeout(main,500);
        }

    }

    main();

})();