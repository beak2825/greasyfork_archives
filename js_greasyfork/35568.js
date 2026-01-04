// ==UserScript==
// @name         Bitcofarm Auto Click
// @namespace    http://romenum.online
// @version      1.0
// @description  feel free to donate: 1KCwhJWdMcnqNECnKBxhZHb4Eu6RWjgg4U
// @author       romenum
// @match        http://bitcofarm.com/ads
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/35568/Bitcofarm%20Auto%20Click.user.js
// @updateURL https://update.greasyfork.org/scripts/35568/Bitcofarm%20Auto%20Click.meta.js
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
            process();
        });

        function process() {
            var href = jQuery('#right').find('a[href] > div').not('.disabled_pbx').first().parent().attr('href');
            console.log('opened href: ', href);
            if (!href) return;

            var splitted = href.split('=');
            var ad_id = splitted[1].split('&');
            ad_id = ad_id[0];

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

                        if (myWindow.view == myWindow.settimeout && myWindow.control === 0) {
                            myWindow.control = 1;
                            myWindow.$.get('virtual_core.php','adv='+ad_id+'&action=adv', function(e) {
                                myWindow.$('#desc').hide().html(e).fadeIn().addClass('twirk');
                                console.log(e);
                                if (e == 'Completed!') {
                                    jQuery('#' + ad_id).addClass('disabled_pbx');
                                }
                            });
                        }
                    }, 1000);
                    myWindow.$('#iframe').remove();

                }, 2000);
                jQuery('body').append(ifrm);
            }

            var a = setInterval(function() {
                console.log('Check ad: ' + ad_id);
                if (jQuery('#'+ad_id).hasClass('disabled_pbx')) {
                    console.log('Ad' + ad_id + ' completed');
                    jQuery('#loginIframe').remove();
                    clearInterval(a);
                    setTimeout(function() {
                        process();
                    }, (getRandomInt(1.5, 3.5)*1000));
                } else {
                    console.log('Ad' + ad_id + ' not completed yet!');   
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
    addJQuery(main);
})();