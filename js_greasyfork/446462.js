// ==UserScript==
// @name         T-Swapper
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Automatisch tickets reserveren op TicketSwap
// @author       H
// @match        https://www.ticketswap.com/event/rock-werchter-2022/camping-the-hive/*/*
// @match        https://www.ticketswap.be/event/rock-werchter-2022/camping-the-hive/*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ticketswap.com
// @grant        GM_notification
// @require      http://code.jquery.com/jquery-1.12.4.min.js
// @require      https://greasyfork.org/scripts/383527-wait-for-key-elements/code/Wait_for_key_elements.js?version=701631
// @license      MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/446462/T-Swapper.user.js
// @updateURL https://update.greasyfork.org/scripts/446462/T-Swapper.meta.js
// ==/UserScript==

/* globals jQuery, $, waitForKeyElements */

var keyElementText = 'Camping The Hive';
var min = 3000;
var max = 7000;

var overlay = $('<div id="overlay">⚠️ Script actief!</div>');
overlay.css("padding", "15px");
overlay.css("border-radius", "25px");
overlay.css("position","fixed");
overlay.css("top","17px");
overlay.css("left","15px");
overlay.css("background-color","#000");
overlay.css("filter","alpha(opacity=70)");
overlay.css("-moz-opacity","0.7");
overlay.css("-khtml-opacity","0.7");
overlay.css("opacity","0.7");
overlay.css("z-index","10000");
overlay.appendTo(document.body);


if($("h1:contains('403 Forbidden')").length > 0)
{
    GM_notification({title: 'T-Swapper', text: 'Forbidden! Ze hebben u door, het zit er even op...', image: 'https://s3-eu-west-1.amazonaws.com/ticketswap-public/public/downloads/bm-blue.png'});
}
else
{
    if (/\.(be)\/?$/i.test(document.domain)) {
        document.getElementById("overlay").innerHTML = '⚠️ Belgische versie van TicketSwap werkt niet...';
        var currentBe = window.location.href;
        var redirectToCom = currentBe.replace('.be', '.com');
        window.location.href = redirectToCom;
    } else {
        if ($("button:contains('Login')").length > 0)
        {
            document.getElementById("overlay").innerHTML = '⚠️ Niet ingelogd...';
            window.location.href = "https://www.ticketswap.com/login";
        }
        else
        {
            var rndMilliseconds = Math.floor(Math.random() * (max - min + 1) + min);

            waitForKeyElements (
                "span:contains('" + keyElementText + "')",
                main,
                true
            );

            var hold = "";

            function blinkTitle(msg1, msg2, delay, isFocus, timeout) {
                if (isFocus == null) {
                    isFocus = false;
                }

                if (timeout == null) {
                    timeout = false;
                }

                if (timeout) {
                    setTimeout(blinkTitleStop, timeout);
                }

                document.title = msg1;

                if (isFocus == false) {
                    hold = window.setInterval(function() {
                        if (document.title == msg1) {
                            document.title = msg2;
                        } else {
                            document.title = msg1;
                        }
                    }, delay);
                }

                if (isFocus == true) {
                    var onPage = false;
                    var testflag = true;
                    var initialTitle = document.title;

                    window.onfocus = function() {
                        onPage = true;
                    };

                    window.onblur = function() {
                        onPage = false;
                        testflag = false;
                    };

                    hold = window.setInterval(function() {
                        if (onPage == false) {
                            if (document.title == msg1) {
                                document.title = msg2;
                            } else {
                                document.title = msg1;
                            }
                        }
                    }, delay);
                }
            }

            function blinkTitleStop() {
                clearInterval(hold);
            }

            function main(jNode) {
                started = true;

                if($('a[href*="listing"]').length > 0)
                {
                    document.getElementById("overlay").innerHTML = '⚠️ Er is een aanbod! Aan het klikken...';
                    var clickEvent = document.createEvent ('MouseEvents');
                    clickEvent.initEvent ('click', true, true);
                    $('a[href*="listing"]')[0].dispatchEvent (clickEvent);
                }
                else
                {
                    document.getElementById("overlay").innerHTML = '⚠️ ' + Math.round(rndMilliseconds / 1000) + ' seconden wachten op herladen...';
                    setTimeout(function() {
                        document.getElementById("overlay").innerHTML = '⚠️ Herladen...';
                        location.reload();
                    }, rndMilliseconds);
                }
            }

            // Triggered when clicking the listing (React.js)
            (function(history){
                var pushState = history.pushState;
                history.pushState = function(state) {
                    if (typeof history.onpushstate == "function") {
                        history.onpushstate({state: state});
                    }
                    if(!arguments[2].includes("cart")){
                        GM_notification({title: 'T-Swapper', text: 'Er is een ticket gevonden! Maar misschien heeft iemand anders het al...', image: 'https://s3-eu-west-1.amazonaws.com/ticketswap-public/public/downloads/bm-blue.png'});
                        document.getElementById("overlay").innerHTML = '⚠️ Twee seconden aan het wachten om op de knop te klikken...';
                        setTimeout(function() {
                            $('button:contains("Koop ticket")').click();
                            $('button:contains("Buy ticket")').click();
                        }, 2000);
                    }

                    if(arguments[2].includes("cart")){
                        GM_notification({title: 'T-Swapper', text: 'In het winkelmandje... Jouw beurt!', image: 'https://s3-eu-west-1.amazonaws.com/ticketswap-public/public/downloads/bm-blue.png'});
                        blinkTitle("🚨 Je hebt beet!", document.title, 1000);
                        document.getElementById("overlay").innerHTML = '⚠️ In het winkelmandje... Jouw beurt!';
                    }

                    return pushState.apply(history, arguments);
                }
            })(window.history);
        }
    }

    setTimeout(function() {
        document.getElementById("overlay").innerHTML = '⚠️ Er ging iets niet goed! Herladen...';
        location.reload();
    }, max + 1000);
}
