// ==UserScript==
// @name         NorkoScript
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Viva el Lider carajo
// @author       You
// @match        https://www.managerzone.com/*
// @icon         https://i.ibb.co/bzDTnT0/s-nk.gif
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430974/NorkoScript.user.js
// @updateURL https://update.greasyfork.org/scripts/430974/NorkoScript.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var flag_nk = 'https://i.ibb.co/bzDTnT0/s-nk.gif';
    var flag_ar = 'nocache-758/img/flags/s_ar.gif';
    var flag_ar_2 = 'img/flags/s_ar.gif';
    var round_nk = 'https://i.ibb.co/q0cmsrm/nk-round2.png';
    var round_ar = 'nocache-758/img/flags/15/ar.png';
    var round_ar_2 = 'nocache-758/img/flags/10/ar.png';
    var nk_fed = 'https://www.managerzone.com/?p=federations&fid=1807';

    Run();

    function Run() {
        if(hasRoundFlag()) {
            var checkExist = setInterval(function() {
                if (document.getElementById('thePlayers_0')) {
                    replaceRoundFlags();
                    clearInterval(checkExist);
                }
            }, 1000);
        }
        replaceFlags();
        replaceFlagsForum();
        replaceCountry();
    }

    function hasRoundFlag() {
        if(window.location.href == 'https://www.managerzone.com/?p=transfer' ||
          window.location.href == 'https://www.managerzone.com/?p=worldmap') {
            return true;
        }
        else {
            return false;
        }
    }

    function replaceFlags() {
        let allImgs = document.getElementsByTagName("img");
        for (var i = 0; i < allImgs.length; ++i) {
            if(allImgs[i].attributes.src.value == flag_ar || allImgs[i].attributes.src.value == flag_ar_2) {
                allImgs[i].attributes.src.value = flag_nk;
                if(allImgs[i].attributes.title) {
                    allImgs[i].attributes.title.nodeValue = 'Corea del Norte';
                }
            }
        }
    }

    function replaceFlagsForum() {
        let all = document.getElementsByClassName("topics-col-author");
        for (var i = 0; i < all.length; ++i) {
            if(all[i].children.length > 2) {
                if(all[i].children[2].href == nk_fed) {
                    all[i].children[1].children[0].attributes.src.value = round_nk;
                }
            }
        }
    }

    function replaceRoundFlags() {
        var allImgs = document.getElementsByTagName('img');
        for (var i = 0; i < allImgs.length; ++i) {
            if(allImgs[i].attributes.src.value == round_ar || allImgs[i].attributes.src.value == round_ar_2) {
                allImgs[i].attributes.src.value = round_nk;
                allImgs[i].attributes.title.nodeValue = 'Corea del Norte';
            }
        }
    }

    function replaceCountry() {
        let allTxt = document.getElementsByClassName("nobreak bold");
        for (var i = 0; i < allTxt.length; ++i) {
            if(allTxt[i].textContent == 'Argentina') {
                allTxt[i].textContent = 'Corea del Norte';
            }
        }
    }
})();