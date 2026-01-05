// ==UserScript==
// @name         Ninja Button - Duolingo Japanese
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Add a "Ninja Button" to access Duolingo's Japanese course while using a web browser. 
// @author       mca62511
// @domain       duolingo.com
// @domain       www.duolingo.com
// @match        https://www.duolingo.com/*
// @match        https://duolingo.com/*
// @match        http://www.duolingo.com/*
// @match        http://duolingo.com/*
// @grant        none
// @locale       en
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/29896/Ninja%20Button%20-%20Duolingo%20Japanese.user.js
// @updateURL https://update.greasyfork.org/scripts/29896/Ninja%20Button%20-%20Duolingo%20Japanese.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var $ninjaButton = $('<li class="language-choice " data-value="ja"><a href="javascript:;"><span class="flag flag-svg-micro flag-ja" style="background: url(\'http://res.cloudinary.com/mca62511/image/upload/r_3000/v1495271437/up1spqr_mcwwgi.png\') !important; background-size: contain !important;"></span><span data-value="ja">Ninja</span></a></li>');
    $ninjaButton.hide();
    $(".topbar-username").hover(function(){
        $ninjaButton.hide();
    });
    $(".topbar-language").hover(function(){
        $ninjaButton.show();
    });
    var $sadAlert = $('<div style=\'box-shadow: 0px 3px 5px 0px rgba(00,00,00,0.3); font-weight: 600; cursor: pointer; padding: 1em; border-radius: 1em; display: flex !important; align-items: center; position: fixed; width: 500px !important; bottom: 50px !important; right: 50px !important; background: #F44336; color: white !important;  z-index: 9000 !important;\'><img style="height: 120px; width: 120px;" src="http://res.cloudinary.com/mca62511/image/upload/v1495857085/cryingninja_ddu3au.png"><p>Duolingo has changed the way language selection works breaking the "Ninja Button" extension. Please remove it from the dashboard of your script manager.</p></div>');
    if ( $("ul.dropdown-menu").length ) {
        $("ul.dropdown-menu").append($ninjaButton);
    } else {
        $("body").append($sadAlert);
    }
    setTimeout(function(){
        $sadAlert.fadeOut();
    }, 12000);
    $sadAlert.click(function(){
        $sadAlert.hide();
    });
})();