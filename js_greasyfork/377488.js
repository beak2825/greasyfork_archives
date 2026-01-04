// ==UserScript==
// @name         JSON-LD from IMDb to QuickStatements
// @version      0.9.0
// @description  Gets data from JSON-LD from IMDb to QuickStatements, to publish it on Wikidata
// @author       CennoxX
// @namespace    https://greasyfork.org/users/21515
// @homepage     https://github.com/CennoxX/userscripts
// @supportURL   https://github.com/CennoxX/userscripts/issues/new?title=[JSON-LD%20from%20IMDb%20to%20QuickStatements]%20
// @match        https://www.imdb.com/*
// @match        https://quickstatements.toolforge.org/*
// @connect      www.wikidata.org
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wikidata.org
// @grant        GM.xmlHttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/377488/JSON-LD%20from%20IMDb%20to%20QuickStatements.user.js
// @updateURL https://update.greasyfork.org/scripts/377488/JSON-LD%20from%20IMDb%20to%20QuickStatements.meta.js
// ==/UserScript==
/* jshint esversion: 10 */
/* eslint quotes: ['warn', 'single', {'avoidEscape': true}] */
/* eslint curly: 'off' */

(function() {
    'use strict';
    //
    //QuickStatements
    //
    if (location.href == 'https://quickstatements.toolforge.org/#/batch') {
        var quickstatements = '';
        var evt = document.createEvent('HTMLEvents');
        evt.initEvent('input', false, true);
        GM_setValue('quickstatements','');
        var checkForChanges = setInterval(function() {
            if (quickstatements) {
                var quickForm = document.querySelector('textarea.form-control');
                if (!quickForm.innerHTML.includes(quickstatements)){
                    quickForm.innerHTML += quickstatements;
                }
                GM_setValue('quickstatements','');
                quickForm.dispatchEvent(evt);
                quickstatements = '';
            }else{
                quickstatements = GM_getValue('quickstatements');
            }
        }, 250);
    }
    //
    //IMDb
    //
    else if (location.host == 'www.imdb.com'){
        var request = 0;
        var done = 0;
        var i = 0;
        var val = [];
        var jsonld = JSON.parse(document.querySelector('script[type="application/ld+json"]').innerText);

        //item
        var item = '';
        getWikidataId(jsonld,'item');

        //startTime/publication date
        if (jsonld['@type'] == 'TVSeries') {
            pushQSString('P580', jsonld.datePublished);
        } else if (jsonld['@type'] == 'Movie' || jsonld['@type'] == 'TVEpisode') {
            pushQSString('P577', jsonld.datePublished);
        }

        //actor
        if (jsonld.actor) {
            for (i = 0; i < jsonld.actor.length; i++) {
                getWikidataId(jsonld.actor[i],'P161');
            }
        }

        //creator/writer
        if (jsonld.creator) {
            for (i = 0; i < 4; i++) {
                if (jsonld.creator[i] && jsonld.creator[i].name) {
                    if (jsonld['@type'] == 'TVSeries') {
                        getWikidataId(jsonld.creator[i],'P170');
                    } else if (jsonld['@type'] == 'Movie') {
                        getWikidataId(jsonld.creator[i],'P58');
                    }
                } else {
                    break;
                }
            }
        }

        //director
        if (jsonld.director) {
            for (i = 0; i < jsonld.director.length; i++) {
                getWikidataId(jsonld.director[i], 'P57');
            }
        }

        //birthdate
        pushQSString('P569', jsonld.birthDate);

        //deathdate
        pushQSString('P570', jsonld.deathDate);

        //duration
        getDuration(jsonld.timeRequired);
        getDuration(jsonld.duration);
        function getDuration(time) {
            if (time) {
                var regex = /PT(?:(\d+)H)?(?:(\d+)M)?/;
                var hours = parseInt(time.replace(regex, '$1'));
                hours = isNaN(hours)?0:hours;
                var minutes = parseInt(time.replace(regex, '$2'));
                minutes = isNaN(minutes)?0:minutes;
                minutes = minutes+60*hours;
                pushQSString('P2047', minutes +'U7727');
            }
        }
        //loop to check if ready to set data
        var checkIfComplete = setInterval(function() {
            if (request != 0 && (done/request) == 1 && GM_getValue('quickstatements')=='') {
                var tempQ = '';
                val.sort().forEach(function(entry) {
                    tempQ += item +entry;
                });
                if (tempQ && item){
                    GM_setValue('quickstatements',tempQ);
                }
                clearInterval(checkIfComplete);
            }
        }, 500);

        function getWikidataId(id,prop) {
            request++;
            GM.xmlHttpRequest({
                method: 'GET',
                url: 'https://www.wikidata.org/w/api.php?action=query&format=json&list=search&srsearch=haswbstatement:P345=' + id.url.split('/')[2] + '&type=' + prop,
                onload: function(response) {
                    done++;
                    if (response.responseText.length > 0) {
                        var jsonObj = JSON.parse(response.responseText);
                        if (jsonObj.query.search[0] != null) {
                            var qid = jsonObj.query.search[0].title;
                            var property = response.finalUrl.split('type=')[1].split('&')[0];
                            if (property == 'item'){
                                item = qid;
                            } else {
                                pushQSString(property,qid);
                            }
                        }
                    }
                },
                onerror: function(response) {
                    done++;
                    console.log('Error in fetching contents: ' + response.responseText);
                }

            });
        }

        function pushQSString(property, data) {
            if (data){
                val.push('|' + property + '|' + (!isNaN(Date.parse(data))? '+'+data+'T00:00:00Z/11':data) + '|S248|Q37312|S345|"'+location.href.split('/')[4]+'"|S813|+'+new Date().toISOString().substring(0, 11)+'00:00:00Z/11\n');
            }
        }
    }
})();
