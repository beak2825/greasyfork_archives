// ==UserScript==
// @name         BitcoFarm Click Ads
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Auto Click Ads BitcoFarm
// @author       Cook Wu, Modified from Chip.vlz Version
// @match        http://bitcofarm.com/ads
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36771/BitcoFarm%20Click%20Ads.user.js
// @updateURL https://update.greasyfork.org/scripts/36771/BitcoFarm%20Click%20Ads.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addJQuery(callback) {
        var script = document.createElement("script");
        script.setAttribute("src", "//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js");
        script.addEventListener('load', function() {
            var script = document.createElement("script");
            script.textContent = "window.jQ=jQuery.noConflict(true);(" + callback.toString() + ")();";
            document.body.appendChild(script);
        }, false);
        document.body.appendChild(script);
    }

    function main(){
        jQuery(function() {
            setTimeout(function() {
                process();
            }, 17000);
        });

        function process() {
            var href = jQuery('#right').find('a[href] > div').not('.disabled_pbx').first().parent().attr('href');
            console.log('opened href: ', href);
            if (!href){
                location.reload();
            }

            var splitted = href.split('=');
            var ad_id = splitted[1].split('&');
            ad_id = ad_id[0];
            var secondCount = 0;

            prepareLoginFrame(href, ad_id);
            function prepareLoginFrame(href, ad_id) {
                var ifrm = jQuery("<iframe></iframe>");                
                ifrm.attr('id', 'loginIframe');
                ifrm.attr("src", href);
                ifrm.css({
                    'width': '640px',
                    'height': '480px',
                    'position': 'fixed',
                    'top': '50%',
                    'left': '50%',
                    'transform': 'translate(-50%, -50%)'
                });
                setTimeout(function() {
                    var myWindow = jQuery('#loginIframe')[0].contentWindow;

                    for (var i = 1; i < 99999; i++) {
                        myWindow.clearInterval(i);
                    }
                    myWindow.view = 0;
                    myWindow.control = 0;
                    myWindow.settimeout = 12;
                    myWindow.startit = 1;
                    myWindow.setInterval(function() {
                        if(myWindow.view < myWindow.settimeout) {
                            if (myWindow.startit > 0) {
                                myWindow.view = myWindow.view + 1;
                                var width = (myWindow.view*100) / myWindow.settimeout;
                                myWindow.$('#barload').css('width', width + '%');
                            }
                        }

                        if (myWindow.view == myWindow.settimeout && myWindow.control == 0) {
                            myWindow.control = 1;
                            myWindow.$.get('virtual_core.php','adv='+ad_id+'&action=adv', function(e) {
                                myWindow.$('#desc').hide().html(e).fadeIn().addClass('twirk');
                                console.log(e);
                                if (e == 'Completed!') {
                                    jQuery('#' + ad_id).addClass('disabled_pbx');
                                    myWindow.$('#iframe').remove();
                                }
                                if (e == 'Already Clicked!') {
                                    jQuery('#' + ad_id).addClass('disabled_pbx');
                                    jQuery('#' + ad_id).remove();
                                    jQuery('#loginIframe').remove();
                                    myWindow.$('#iframe').remove();
                                }
                            });
                        }
                    }, 1000);
                    myWindow.$('#iframe').remove();
                    document.createElement("script");
                }, 2000);
                jQuery('body').append(ifrm);
            }

            var a = setInterval(function() {
                console.log('Check ad: ' + ad_id);
                secondCount++;
                if (jQuery('#'+ad_id).hasClass('disabled_pbx')) {
                    console.log('Ad' + ad_id + ' completed');
                    jQuery('#loginIframe').remove();
                    jQuery('#' + ad_id).remove();
                    clearInterval(a);
                    secondCount = 0;
                    setTimeout(function() {
                        process();
                    }, (getRandomInt(5, 10)*1000));
                } else {
                    if(jQuery('#loginIframe').length){
                        console.log('Ad' + ad_id + ' not completed yet!');
                        if(secondCount > 60){
                            location.reload();
                        }
                    }                        
                    else{
                        secondCount = 0;
                        console.log('Ad' + ad_id + ' completed');
                        jQuery('#loginIframe').remove();
                        jQuery('#' + ad_id).remove();
                        clearInterval(a);
                        setTimeout(function() {
                            process();
                        }, (getRandomInt(5, 10)*1000));
                    }
                }
            }, 1000);

            function gup(name) {
                name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
                var regexS = "[\\?&]"+name+"=([^&#]*)";
                var regex = new RegExp(regexS);
                var results = regex.exec(window.location.href);
                return results[1] || '';
            }

            function getRandomInt(min, max) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }
            
            
        }
    }
    jQuery('#right').find('a[href] > div.disabled_pbx').remove();
    addJQuery(main);
})();