/* global $ */
// ==UserScript==
// @name         Auto
// @version      1
// @description  Auto Fill
// @author       Vietkhanh Bean (fb.com/vietkhanhbean)
// @require https://code.jquery.com/jquery-3.3.1.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.4.1/jquery.cookie.min.js
// @match        https://www.ha-lab.com/games/dragon-city
// @match        https://dc4u.eu/games/dragon-city
// @grant        none
// @namespace https://greasyfork.org/users/188746
// @downloadURL https://update.greasyfork.org/scripts/368808/Auto.user.js
// @updateURL https://update.greasyfork.org/scripts/368808/Auto.meta.js
// ==/UserScript==

(function() {
    function hahaha() {
        if($('.dlRequest:visible').is(':visible'))
        {
            $('.dlResources').val("food");
            $('input[name="captchaKey"').val("");
            $('input[name="captchaKey"]').focus();
            $('input[name="captchaKey"]').on('input',function(e){
                if($("input[name='captchaKey']").val().length >= 4) {
                    $('.dlRequest')[0].click();
                }
            });
            var checkExist = setInterval(function() {
                var lol = $('.dlHackInfo').text();
                if(lol === "Invalid captcha key, please refresh the page or click on the captcha image to generate a new one.") {
                    clearInterval(checkExist);
                    var prompt1 = prompt("Invalid captcha key!, Please re-enter captcha key.");
                    $('input[name="captchaKey"]').val(prompt1);
                    $('.dlRequest').click();
                    var checkExist2 = setInterval(function() {
                        if ($('.dlSkipAd:visible').is(':visible')) {
                            $('.dlSkipAd')[0].click();
                            clearInterval(checkExist2);
                        }
                    }, 100);
                }

                else if(lol === "Something went wrong, please try again") {
                    clearInterval(checkExist);
                    window.location.reload(true);
                }

                else if(lol === "Please refresh the page and skip the ads first.") {
                    clearInterval(checkExist);
                    window.location.reload(true);
                }

                else if ($('.dlSkipAd:visible').is(':visible')) {
                    $('.dlSkipAd')[0].click();
                    clearInterval(checkExist);
                }
            }, 100); // check every 100ms
        }
        else
        {
            $('.dlSkipAd')[0].click();
        }
    }
        setTimeout(function() { hahaha(); }, 1500);

})();