// ==UserScript==
// @icon          http://adsjob4u.com/img/favicon.png
// @name         Adsjob4u.com Only 30 Sec Ads
// @namespace    http://moneybot24.com/
// @version      1.1
// @description  Sign up: http://www.adsjob4u.com/ - Login, click on view ads and the bot starts automatically
// @author       MoneyBot24.com
// @match        http://adsjob4u.com/*
// @downloadURL https://update.greasyfork.org/scripts/370648/Adsjob4ucom%20Only%2030%20Sec%20Ads.user.js
// @updateURL https://update.greasyfork.org/scripts/370648/Adsjob4ucom%20Only%2030%20Sec%20Ads.meta.js
// ==/UserScript==

(function() {
    if(window.location.href.indexOf("http://www.adsjob4u.com/ads") > -1){
        setInterval( function() {
            if (document.hasFocus())
            {
                var o =  $(".hap:contains('30 Points')").not('.disabled_pbx').parent().not('#right');
                if(o.length === 0) location.href = location.href;
                o.addClass('disabled_pbx');
                console.log(o.attr('href'));
                window.open(o.attr('href'));
            }}, 1000);
    }
    else if(window.location.href.indexOf("http://www.adsjob4u.com/modules/adview.php") > -1)
    {
        $('#bitmedad').prepend('<a href="//moneybot24.com/" target="_blank""><img src="http://www.adsjob4u.com/" height="100%"/></a>');
        setInterval( function(){
            if($('#desc').text() === 'Completed!'){
                window.close();
            }
            else if($('#desc').text().trim() === 'Already Clicked!'){
                window.close();
            }
        }, 1000);
    }
})();