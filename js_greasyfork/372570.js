// ==UserScript==
// @name             WME Install Popularity
// @namespace        https://greasyfork.org/users/30701-justins83-waze
// @version          0.3
// @description      Displays the place in the top 100 installed WME scripts
// @author           JustinS83
// @include          https://greasyfork.org/en/users/*
// @grant            none
// @contributionURL  https://github.com/WazeDev/Thank-The-Authors
// @run-at           document-end
// @downloadURL https://update.greasyfork.org/scripts/372570/WME%20Install%20Popularity.user.js
// @updateURL https://update.greasyfork.org/scripts/372570/WME%20Install%20Popularity.meta.js
// ==/UserScript==

/* ecmaVersion 2017 */
/* global $ */
/* eslint curly: ["warn", "multi-or-nest"] */

(function() {
    'use strict';

    function loadScript(url, callback) {
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.onload = function () {
            if(callback != null)
                callback();
        };

        script.src = url;
        document.getElementsByTagName("head")[0].appendChild(script);
    }

    function init(){
        var WMESearchPageDiv = document.createElement('div');
        WMESearchPageDiv.id="results";
        WMESearchPageDiv.style.cssText = "display:none;";
        document.body.appendChild(WMESearchPageDiv);
        $('#results').load('https://greasyfork.org/en/scripts?q=WME&sort=total_installs .script-list', get2ndPage);
    }

    function get2ndPage(){
        var WMESearchPageDiv2 = document.createElement('div');
        WMESearchPageDiv2.id="results2";
        WMESearchPageDiv2.style.cssText = "display:none;";
        document.body.appendChild(WMESearchPageDiv2);
        $('#results2').load('https://greasyfork.org/en/scripts?page=2&q=WME&sort=total_installs .script-list li', parseResults);
    }

    function parseResults(){
        $('#results2 li').each(function(){
            $(this).appendTo('#results ol');
        });
        $('#results2').remove();

        $('#user-script-list li').each(function(){
            let placeModifier = 0;
            let name = $(this).attr('data-script-name');
            let author = $(this).attr('data-script-author-name');

            if(name.indexOf("WME") > -1){
                let results = $('#results .script-list li');
                for(let i=0;i< results.length; i++){
                    if($($('#results .script-list li')[i]).attr('data-script-name') !== undefined){
                        if($($('#results .script-list li')[i]).attr('data-script-name').indexOf(name) > -1 && $($('#results .script-list li')[i]).attr('data-script-author-name') === author){
                            $(this).find('dd.script-list-total-installs').after(`<dt>WME Most Installed Place</dt><dd>${i+1-placeModifier}</dd>`);
                            break;
                        }
                    }
                    else{
                        placeModifier += 1;
                    }
                }
            }
        });
    }

    loadScript("https://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js", init);
})();