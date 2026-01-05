// ==UserScript==
// @name         TVC-TVT Integration
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Click on episodes to get to the torrents page
// @author       M.Seven
// @match        *://www.pogdesign.co.uk/cat/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/19835/TVC-TVT%20Integration.user.js
// @updateURL https://update.greasyfork.org/scripts/19835/TVC-TVT%20Integration.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var mapping = {};

    var cache = GM_getValue('mapping');

    if (cache) {
        mapping = cache;
        console.info('loading tv torrents list from cache');
    } else {
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://freshon.tv/browse.php",
            onload: function(response) {
                var arr = response.responseText.split('<select')[1].split('<option');
                arr.forEach(function(val){
                    var m = val.match(/value="([0-9]+)".*?>(.*?)<.*?/i);
                    if (m) {
                        mapping[m[2]] = m[1];
                    }
                });
                console.info('finished loading tv torrents list');
                GM_setValue('mapping',mapping);
                console.info('writing tv torrents list to cache');
            }
        });
    }
//    $('div.ep.info span p span').click(function(event){
//        var div = $(this).parent().parent().parent();
//        var name = $(div).find('a:first-child').html();
    $('div.ep.info').click(function(event){
        var name = $(this).find('a:first-child').html();
        var id = mapping[name];
        if (!id) {
            var stripName = name.replace(/\W+/g, ' ').toLowerCase().trim(), bestMatch, maxWords=0;
            for (var key in mapping) {
                if (mapping.hasOwnProperty(key)) {
                    var wordCount = 0, stripKey = key.replace(/\W+/g, '').toLowerCase();
                    stripName.split(' ').forEach(function (word) {
                        if (stripKey.indexOf(word) != -1) {
                            wordCount++;
                        }
                    });
                    if (wordCount>maxWords) {
                        maxWords = wordCount;
                        bestMatch = key;
                    }
                }
            }
            id = mapping[bestMatch];
            console.info('best match:',bestMatch,'| words:',maxWords);
        } else {
            console.info('exact match:',name);
        }
        window.open('https://freshon.tv/browse.php?cat='+id);
        event.preventDefault();
    });
})();