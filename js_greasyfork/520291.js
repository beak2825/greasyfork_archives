// ==UserScript==
// @name           THISVID LOGIN 2.0
// @version        1.0
// @namespace      thieved.com auto login
// @description    Blah
// @inject-into    content
// @match          https://thisvid.com/
// @match          https://thisvid.com/login.php
// @require        https://code.jquery.com/jquery-latest.min.js
// @grant          GM_xmlhttpRequest
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          unsafeWindow
// @icon           https://www.google.com/s2/favicons?domain=www.temu.com
// @run-at         document-end
// @downloadURL https://update.greasyfork.org/scripts/520291/THISVID%20LOGIN%2020.user.js
// @updateURL https://update.greasyfork.org/scripts/520291/THISVID%20LOGIN%2020.meta.js
// ==/UserScript==


(function() {

    console.log('=============||||| RUNNING THISVID LOGIN 2.0 |||||==============');



    function loginFunct() {

        var count = 0;
        setTimeout(function(){

            $('#login_username').val('blumondayss');
            $('#login_pass').val('sXoony12#');
            $('#login_remember_me').click();
            
            if(count == 0) {
                setInterval(function () {
                    $('button.login').click();
                    count++;
                }, 2000);
            }

        }, 3000);

    }







    var url = window.location.href;
    
    setTimeout(function(){

        if ( $('.nav-header > li:nth-child(1) > a').text() == "blumondayss" ) {
            console.log('LOGGED IN');
            if (url == "https://thisvid.com/") {
                window.location.replace("https://thisvid.com/gay-newest/");
            }
        } else {
            if (url == "https://thisvid.com/") {
                console.log("LOGGED OUT");
                window.location.replace("https://thisvid.com/login.php");
            }

            if (url == "https://thisvid.com/login.php") {
                console.log("LOGGING IN / loginFunct()");
                loginFunct();
            }
        }
        
    }, 2000);


    
    







    $(document).on("click", function(e) {
        console.log(e.target);
    });


})();
