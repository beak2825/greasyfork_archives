// ==UserScript==
// @name         WaniKani Dashboard Level Progress Detail
// @version      0.1.0
// @description  Show detailed progress bars.
// @require      https://cdn.rawgit.com/curious-attempt-bunny/wanikani-user-script-helper/4374eae6a4a284c3c3da9d50caa83b8e1a1a6e5d/loader.js
// @author       hitechbunny
// @include      https://www.wanikani.com/
// @include      https://www.wanikani.com/dashboard
// @include      https://www.wanikani.com/review
// @run-at       document-end
// @grant        none
// @namespace https://greasyfork.org/users/149329
// @downloadURL https://update.greasyfork.org/scripts/34866/WaniKani%20Dashboard%20Level%20Progress%20Detail.user.js
// @updateURL https://update.greasyfork.org/scripts/34866/WaniKani%20Dashboard%20Level%20Progress%20Detail.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Hook into App Store
    try { $('.app-store-menu-item').remove(); $('<li class="app-store-menu-item"><a href="https://community.wanikani.com/t/there-are-so-many-user-scripts-now-that-discovering-them-is-hard/20709">App Store</a></li>').insertBefore($('.navbar .dropdown-menu .nav-header:contains("Account")')); window.appStoreRegistry = window.appStoreRegistry || {}; window.appStoreRegistry[GM_info.script.uuid] = GM_info; localStorage.appStoreRegistry = JSON.stringify(appStoreRegistry); } catch (e) {}

    var locked_data_url = "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkAQMAAABKLAcXAAAABlBMVEX////p6emlmyooAAAAAnRSTlMAgJsrThgAAAA1SURBVDjLY3huea54DpQ4wIBgnyuewDAHSdKAAUnhuQIGJIVzHjCMmjJqyqgpo6aMmkKkKQC2XQWeSEU1BQAAAABJRU5ErkJggg==')";

    function render(json) {
        $('.progression').empty();

//        console.log(json);

        while(json.progresses.length > 3) {
            var progress = json.progresses[0];
            if (progress.max === 0 || progress.gurued_total*100.0/progress.max >= 90) {
                json.progresses = json.progresses.slice(1);
            } else {
                break;
            }
        }

        var stageNames = ['', 'Apprentice I', 'Apprentice II', 'Apprentice III', 'Apprentice IV'];
        json.progresses.forEach(function(progress, j) {
            var html =
                '<div id="progress-'+progress.level+'-'+progress.type+'" class="vocab-progress">'+
                '  <h3>Level '+progress.level+' '+progress.type+' Progression</h3>'+
                '  <div class="chart">'+
                '    <div class="progress" title="Unstarted ('+progress.srs_level_totals[0]+'/'+progress.max+')">'+
                '      <div class="bar" title="Guru+ ('+progress.gurued_total+'/'+progress.max+')"  style="background-color: #a100f1; background-image: linear-gradient(to bottom, #a0f, #9300dd); width: '+(progress.gurued_total*100.0/progress.max)+'%;">'+
                '        <span class="dark" style="display: none;">&nbsp;</span>'+
                '      </div>';

            var opacity = 0.5;
            for(var i=4; i>=1; i--) {
                var percentage = progress.srs_level_totals[i]*100.0/progress.max;
                //console.log(cssClass, i, progress.srs_level_totals[i], progress.max, percentage);

                html +=
                    '      <div class="bar bar-supplemental"  title="'+stageNames[i]+' ('+progress.srs_level_totals[i]+'/'+progress.max+')" style="opacity: '+opacity+'; background-color: #a100f1; background-image: linear-gradient(to bottom, #f0a, #dd0093); width: '+(percentage)+'%;">'+
                    '        <span class="dark" style="display: none;"></span>'+
                    '      </div>';

                opacity *= 0.7;
            }

            var unlockedCount = 0;
            progress.srs_level_totals.forEach(function(srs_level_total) {
                unlockedCount += srs_level_total;
            });
            var lockedCount = progress.max - unlockedCount;

            html +=
                '      <div class="bar bar-supplemental" title="Locked ('+lockedCount+'/'+progress.max+')" style="float:right; background-color: #a8a8a8; background-image: '+locked_data_url+'; width: '+(lockedCount*100.0/progress.max)+'%;">'+
                '        <span class="dark" style="display: none;"></span>'+
                '      </div>';

            html +=
                '    </div>'+progress.gurued_total+'<span class="pull-right total">'+progress.max+'</span>'+
                '  </div>'+
                '</div>';

            if (j != json.progresses.length-1) {
                //html += '<hr class="custom-splitter"/>';
            }

            $('.progression').append(html);
        });
    }

    var cached_json = localStorage.getItem('level-progress-cache');
    if (cached_json) {
        render(JSON.parse(cached_json));
    }

    window.WKHelper.init(GM_info, function() {
        window.WKHelper.ajax_retry('https://wanikanitools-golang.curiousattemptbunny.com/level/progress?api_key='+window.WKHelper.api_key_v2).then(function(json) {
            localStorage.setItem('level-progress-cache', JSON.stringify(json));
            render(json);
        });
    });
})();