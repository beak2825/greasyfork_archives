// ==UserScript==
// @name           Carnival
// @version        1.0
// @namespace      js_notes
// @description    Blah
// @match          https://internet.cclfunhub.com/carnival/*
// @match          https://gen.xyz*
// @require        https://code.jquery.com/jquery-latest.min.js
// @grant          GM_xmlhttpRequest
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          unsafeWindow
// @icon           https://www.google.com/s2/favicons?domain=www.carnival.com
// @run-at         document-start
// @downloadURL https://update.greasyfork.org/scripts/498807/Carnival.user.js
// @updateURL https://update.greasyfork.org/scripts/498807/Carnival.meta.js
// ==/UserScript==



var script = document.createElement('script');
script.src = 'https://code.jquery.com/jquery-latest.min.js';
script.setAttribute("id", "customJQuery");
document.body.appendChild(script);





(function() {

    console.log('=============||||| RUNNING CARNIVAL |||||==============');
    $('body').addClass('tampered');


    setTimeout(function(){

        $('#TextBoxFolio').val('56889');
        $('#TextBoxDateOfBirth').val('01/25');


    }, 2000);




/*
    // ========= setInterval COUNTER =========
    setInterval(function () {
        count++;
        console.log(count);
    }, 1000);



    $(".XYZ > div[class*='zzz']").find('span').each(function() {

        var xxx = $(this).text().indexOf("xyz");

        if (xxx) {
            $(this).parents("div[class*='LatestContent__xyz']").remove();
        }
    });







    // ======= COMPARE FAVESLIST =======
    var gmStorage_faves = GM_getValue('favesList');

    var i;
    for (i = 0; i < gmStorage_faves.length; i++) {
        if( username === gmStorage_faves[i].trim().toLowerCase() ) {
            console.log('fave match: '+username);
            $(this).addClass('fave');
            $(this).addClass('flagged');
        }
    }

    // ============== FAVE BUTTONS ==============
    $('.faveBtnOFF').click(function(){
        console.log("faveBtnOFF clicked");
        var faveUser = $(this).parents('.userInfo').find('.user').text();

        var favesList = GM_getValue('favesList');
        favesList.push(faveUser);

        GM_setValue('favesList', favesList);

        faves();
    });













*/





    $(document).on("click", function(e) {
        console.log(e.target);
    });



})();
