// ==UserScript==
// @name         [HWM] TimePortalDataCollector
// @namespace    hwm.name
// @version      0.1
// @description  [HWM] Time Portal Data Collector
// @author       Mr_MYSTIC
// @include      http://www.heroeswm.ru/*
// @include      http://qrator.heroeswm.ru/*
// @include      http://178.248.235.15/*
// @grant        GM_xmlhttpRequest
// @connect      hwm.name
// @connect      hwm.test
// @homepage     https://hwm.name/portal
// @downloadURL https://update.greasyfork.org/scripts/22346/%5BHWM%5D%20TimePortalDataCollector.user.js
// @updateURL https://update.greasyfork.org/scripts/22346/%5BHWM%5D%20TimePortalDataCollector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getPlId() {

        var plLink = getXPath("//a[contains(@href, 'pl_hunter_stat.php')]").snapshotItem(0);

        if (plLink === null) {
            return false;
        }

        return plLink.href.substring(plLink.href.indexOf('=') + 1);
    }

    function getXPath(xpath, element) {

        return document.evaluate(xpath, (!element ? document : element), null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    }

    if (window.location.pathname.indexOf('tj_single_set.php') !== -1) {
        var options = document.querySelectorAll('select[name="mid"] option');

        var data = [];
        for (var i = 0; i < options.length; i++) {
            var entry = {};
            var value = options[i].value.split('.')[0];
            entry.id = value;
            var regExp = new RegExp(/.+ ([\d]{1,}) шт. за ([\d]{1,}) кр./);
            var result = regExp.exec(options[i].innerHTML);
            entry.amount = result[1];
            entry.price = result[2];
            entry.pl_id = getPlId();
            data.push(entry);
        }

        GM_xmlhttpRequest({
            method: "POST",
            url: 'https://hwm.name/portal_prices/raw_data/' + btoa(JSON.stringify(data)),
            responseType: 'json',
            onload: function(response) {
                console.log(response.response);
            },
            timeout: 10000,
            onerror: function(response) {
                console.log(response);
            }
        });
    }

    if (window.location.pathname.indexOf('object-info.php') !== -1) {
        var test = document.body.innerHTML.indexOf('Найдены') !== -1 || document.body.innerHTML.indexOf('Эти существа уже побеждены') !== -1;

        if (test) {
            var data = {};
            var link = getXPath("//a[contains(@href, 'army_info.php')]").snapshotItem(0);

            data.pl_id = getPlId();
            data.object_id = window.location.search.replace('?id=', '');
            data.monster_id = link.search.replace('?name=', '');

            GM_xmlhttpRequest({
                method: "POST",
                url: 'https://hwm.name/portal_prices/pokemons/' + btoa(JSON.stringify(data)),
                responseType: 'json',
                onload: function(response) {
                    console.log(response.response);
                },
                timeout: 10000,
                onerror: function(response) {
                    console.log(response);
                }
            });
        }
    }
})();