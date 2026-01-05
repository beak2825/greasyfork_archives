// ==UserScript==
// @author         たかだか。(TakaDaka.)
// @name           Adobe Foistware Killer
// @name:ja        Adobe Foistware Killer
// @namespace      https://twitter.com/djtkdk_086969
// @description:ja Adobe製品ダウンロードページの「オプションのプログラム」のチェックを自動的に外します。
// @description    Automatically unchecks the "Optional Offer" checkbox on download pages of Adobe products.
// @include        *://get*.adobe.com/*
// @version        0.31
// @grant          none
// @license        MIT License; https://opensource.org/licenses/mit-license.php
// @compatible     firefox
// @compatible     chrome
// @downloadURL https://update.greasyfork.org/scripts/18604/Adobe%20Foistware%20Killer.user.js
// @updateURL https://update.greasyfork.org/scripts/18604/Adobe%20Foistware%20Killer.meta.js
// ==/UserScript==

(function() {
    console.log("AFK: Started.");
    window.addEventListener ("DOMContentLoaded", check_elem());

    var mo =
        new MutationObserver(function(mutationEventList){
            check_elem();
        });
    var mo_conf = {
        childList: true,
        attributes: false,
        characterData: false,
        subtree: true
    };
    mo.observe(document.querySelector("body"), mo_conf);

    function check_elem() {
        console.log("AFK: Checking elements...");
        var offer = document.getElementById("offersInformationPane");
        if(offer !== null) {
            var cb = offer.getElementsByTagName("input");
            if(cb.length > 0) {
                Array.prototype.slice.call(cb).forEach(function (node) {
                    if(node.checked) {
                        console.log("AFK: Foistware offer detected! Unchecking the checkbox(es).");
                        var event = new Event('change');
                        node.checked = false;
                        node.dispatchEvent(event);
                    }
                });
                if(offer.querySelectorAll("p.afk_info").length === 0) {
                    var info = document.createElement("p");
                    info.className = "afk_info";
                    if(navigator.language.substr(0,2) === "ja") {
                        info.innerHTML = "Adobe Foistware Killer によりオプションのプログラムが拒否されました。";
                    } else {
                        info.innerHTML = "Adobe Foistware Killer declined the optional offer.";
                    }
                    if(location.href.includes("/reader/")) {
                        if(navigator.language.substr(0,2) === "ja") {
                            info.innerHTML += "<br><a href='https://get.adobe.com/jp/reader/enterprise/'>オフライン インストーラはこちらからダウンロードできます。</a>";
                        } else {
                            info.innerHTML += "<br><a href='https://get.adobe.com/jp/reader/enterprise/'>You can download an offline installer here.</a>";
                        }
                    }
                    offer.appendChild(info);
                }
            }
        }
        var offer2 = document.getElementById("chrchk");
        if(offer2 !== null) {
            var cb2 = offer2.getElementsByTagName("input");
            if(cb2.length > 0) {
                Array.prototype.slice.call(cb2).forEach(function (node) {
                    if(node.checked) {
                        console.log("AFK: Foistware offer (Chrome Extension) detected! Unchecking the checkbox(es).");
                        var event = new Event('change');
                        node.checked = false;
                        node.dispatchEvent(event);
                    }
                });
            }
        }
    }
})();

