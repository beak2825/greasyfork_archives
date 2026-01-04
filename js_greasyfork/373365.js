// ==UserScript==
// @name         Gimkit Hack
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Auto Answer Gimkit Questions
// @author       Mikerific
// @match        https://www.gimkit.com/play
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373365/Gimkit%20Hack.user.js
// @updateURL https://update.greasyfork.org/scripts/373365/Gimkit%20Hack.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var url = prompt("What is the ID of the Gimkit? (On the Teachers URL, Example: https://www.gimkit.com/host/<GimkitID>)");
    var ifrm = document.createElement('iframe');
    ifrm.setAttribute('id', 'ifrm');
    ifrm.style.visibility = "hidden";
    document.body.appendChild(ifrm);
    ifrm.setAttribute('src', "https://www.gimkit.com/view/" + url);
    var map = {};
    var auto = false;
    setTimeout(function(){
        var ifrmdoc = ifrm.contentDocument || ifrm.contentWindow.document;
        var quests = ifrmdoc.getElementsByClassName('flex wrap hc vc');
        var ans = ifrmdoc.getElementsByClassName('ant-card-body');
        for (var i = 0; i < ans.length; i++) {
            map[quests[i + 1].textContent] = ans[i].innerText.split('\n')[0];
        }
    }, 2000);

    function answerQuestion(cheatSheet, delay) {
        var words = document.getElementsByClassName('sc-dnqmqq dwXnVu');
        var ans = cheatSheet[words[0].textContent];
        for (var i = 1; i < words.length; i++) {
            if (words[i].textContent.localeCompare(ans) == 0) {
                eventFire(words[i], 'click');
                break;
            }
        }
        var checkContinue = setInterval(function() {
            if (document.getElementsByClassName("animated tada sc-iAyFgw eEcupN").length) {
                setTimeout(function() {goTo('continue')}, delay);
                clearInterval(checkContinue);
            }
        }, 100);
    }

    function goTo(place) {
        var dests = document.getElementsByClassName('sc-dnqmqq dwXnVu');
        if (place.toLowerCase().localeCompare('shop') == 0) {
            document.querySelector("[aria-label='Menu']").click();
            document.querySelectorAll("[role='button']")[1].click();
        } else if (place.toLowerCase().localeCompare('questions') == 0) {
            document.querySelector("[aria-label='Menu']").click();
            document.querySelectorAll("[role='button']")[0].click();
        } else {
            for (var i = 1; i < dests.length; i++) {
                if (dests[i].textContent.toLowerCase().localeCompare('continue') == 0) {
                    eventFire(dests[i], 'click');
                    break;
                }
            }
        }
    }

    function buyNext(upgrade) {
        goTo('shop');
        eventFire(
            document.getElementsByClassName('sc-dfVpRl kBnWSq')[[
                'money',
                'streak',
                'multiplier',
                'insurance'
            ].indexOf(upgrade.toLowerCase())],
            'click'
        );
        var products = document.getElementsByClassName('sc-dnqmqq dwXnVu');
        var wallet = parseInt(document.getElementsByClassName('jss66 jss72 jss86')[1].textContent.replace(/[,$€]/g, ''));
        for (var i = 3; i < products.length; i++) {
            eventFire(products[i], 'mousedown');
            var cost = parseInt(products[1].textContent.replace(/[,$€]/g, ''));
            var bought = products[2].textContent.toLowerCase().localeCompare('already owned') == 0;
            if (!bought && cost <= wallet) {
                eventFire(products[2], 'click');
                break;
            } else if (cost > wallet) break;
        }
        goTo('questions');
    }

    function eventFire(el, etype){
        if (el.fireEvent) {
            el.fireEvent('on' + etype);
        } else {
            var evObj = document.createEvent('Events');
            evObj.initEvent(etype, true, false);
            el.dispatchEvent(evObj);
        }
    }
    window.onmousedown = function(e) {
        console.log(e.target.parentNode.parentNode.parentNode.className);
        if(e.target.parentNode.parentNode.parentNode.className == 'sc-caSCKo bHcGYC') {
            e.preventDefault();
            answerQuestion(map, 1000);
        }
    }
    window.onkeydown = function(e) {
        if(e.metaKey || e.ctrlKey) {
            if (!auto) {
                auto = true;
            } else {
                auto = false;
            }
        }
    }
    setInterval(function() {
        if (auto) {
            answerQuestion(map, 500);
        }
    }, 1500);
    var checkClap = setInterval(function() {
        if (document.getElementsByClassName("sc-cMhqgX bOeCVu").length) {
            setInterval(function() {document.getElementsByClassName("animated pulse infinite")[0].click()}, 1);
            clearInterval(checkClap);
        }
    }, 100);
})();
