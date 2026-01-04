// ==UserScript==
// @name         BitcoMine (AutoClick)
// @version      1.0
// @description  Haz clic en más de 100 anuncios de BitcoMine rapidamente...
// @author       EpeniBot
// @match        http://bitcomine.net/ads
// @grant        none
// @namespace    http://epeni.tk
// @downloadURL https://update.greasyfork.org/scripts/36567/BitcoMine%20%28AutoClick%29.user.js
// @updateURL https://update.greasyfork.org/scripts/36567/BitcoMine%20%28AutoClick%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function addJQuery(callback) {
    document.getElementById('left').insertAdjacentHTML('beforebegin',
'<br><div id="EpeniBot" class="tab-content tab-content-xs" style="border-style: solid;width: 740px;border-color: #D1D1D1;border-radius: 4px;border-style: solid;border-width: 1px; padding-bottom: 9px;padding-left: 9px;padding-right: 9px; margin-left: 118px; padding-top: 9px;display:block"> <div id="dicebotinnerwrap"> <div id="controlWrapper" style="Display:inline-block;"> <left><a href="https://epenibot.blogspot.com/" target="new"><img src="https://i.imgur.com/g1UTR14.gif" /></a> <div id="tipDude" style="Display:inline-block;"></div> </center></div> <div id="ulikey" style="Display:inline-block;"><p><font color="red"><b>Puedes agradecer  con un donativo:</b></font></p> <p><strong>UpHold:</strong> @EpeniBot<br>  <strong>Bitcoin:</strong> 17H6asehjzGDFjDMaT2ATPdHyYzhPvmT3x<br> <b>Litecoin:</b> LgVsW8CiVUH3f7xokKbBaAAkC2kcvM4WZx<br> <b>Ethereum:</b> 0x32144d3455a9D525F7b657Bfa660680163859f70 <br> <b>Bitcoin Cash:</b> 19WCazmR8c8RnxJpsb6zYgDt9iA6te7RU2 <br> <b>Dash:</b> XggLJUcFq8wT67F2cT41FEtWUsX8wRMQVu</p></div> </div>');
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
            var href = jQuery('body').find("a[href*='adview.php'] > div:not(.disabled_pbx):first").parent().attr('href');
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
                    'width': '300px',
                    'height': '180px',
                    'position': 'fixed',
                    'top': '55%',
                    'left': '88%',
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
                    }, (getRandomInt(5, 10)*1000));
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
            setTimeout(function() {
            location.reload();
            }, 17000);
        }
    }
    addJQuery(main);
})();