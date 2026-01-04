// ==UserScript==
// @name           THISVID HOVER
// @version        1.0
// @namespace      thieved.com-hover
// @description    Blah
// @inject-into    content
// @match          https://thisvid.com/*
// @exclude        https://thisvid.com/login.php*
// @require        https://code.jquery.com/jquery-latest.min.js
// @grant          GM_xmlhttpRequest
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          unsafeWindow
// @icon           https://www.google.com/s2/favicons?domain=thisvid.com
// @run-at         document-start
// @downloadURL https://update.greasyfork.org/scripts/520292/THISVID%20HOVER.user.js
// @updateURL https://update.greasyfork.org/scripts/520292/THISVID%20HOVER.meta.js
// ==/UserScript==


(function() {

    console.log('=============||||| US | RUNNING THISVID HOVER |||||==============');
    
    

$(".thumb img").on({
    'touchstart': function(e) {

        var targetElement = e.target; 
        var imgURL = $(this).attr('src');
        var dataCount = parseInt($(this).attr('data-cnt'));
        
        if (dataCount !== 0) {
          console.log("NOT ZERO");

            for (let i = 1; i < dataCount+1; i++) {

                var regex = /(.*\/)(\d.jpg)$/g;
                var newImgURL = imgURL.replace(regex, '$1' +i+ '.jpg');
                console.log(newImgURL);
                $(this).attr('src', newImgURL);

            }

        }

    }
});


 
    
    
    
    
    
    

    $(document).on("hover", function(e) {
        console.log(e.target);
    });
    
})();
