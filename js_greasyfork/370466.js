// ==UserScript==
// @name         honeybot + Faucet Collector
// @namespace   Rekcybertech.blogspot.com/
// @version      0.2
// @description  Sign up: https://anon.to/ELHsuz - Login, click on View Ads and earn satohis
// @author       Rekcybertech Channel
// @match        http://honeybtc.com/*
// @match        https://honeybtc.com/*
// @downloadURL https://update.greasyfork.org/scripts/370466/honeybot%20%2B%20Faucet%20Collector.user.js
// @updateURL https://update.greasyfork.org/scripts/370466/honeybot%20%2B%20Faucet%20Collector.meta.js
// ==/UserScript==

(function() {
    if(window.location.href.indexOf("ads") > -1){
        setInterval( function() {
            if (document.hasFocus())
            {
                var o = $(".asd:not('.disabled_asd'):first");
                if($(".asd:not('.disabled_asd')").length > 0)
                {
                    o.addClass('disabled_asd');
                    var link = o.parent().attr('href');
                    console.log(link);
                    window.open(link);
                }
            }}, 1000);
    }
    else if(window.location.href.indexOf("adview.php") > -1)
    {
        $('#bitmedad').prepend('<a href="//Rekcybertech.blogspot.com//" target="_blank""><img src="//goo.gl/7aXwdt" height="100%"/></a>');
        setInterval( function(){
            if($('#desc').text() === 'Completed'){
                window.close();
            }
            else if($('#desc').text().trim() === 'You already clicked to this ad!'){
                window.close();
            }
        }, 1000);
    }
    else if(window.location.href.indexOf("account") > -1)
    {
        setInterval( function() {
            if($('.ticket').length > -1)
            {
                $('.ticket').click();
            }
        }, 3000);
    }

})();
