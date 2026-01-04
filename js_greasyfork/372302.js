// ==UserScript==
// @name         WaniKani Dashboard Level Progress Detail
// @version      0.1.1.6
// @description  Show detailed progress bars.
// @author       hitechbunny, blazzbolt
// @include      https://www.wanikani.com/
// @include      https://www.wanikani.com/dashboard
// @include      https://www.wanikani.com/review
// @run-at       document-end
// @grant        none
// @namespace https://greasyfork.org/users/149329
// @downloadURL https://update.greasyfork.org/scripts/372302/WaniKani%20Dashboard%20Level%20Progress%20Detail.user.js
// @updateURL https://update.greasyfork.org/scripts/372302/WaniKani%20Dashboard%20Level%20Progress%20Detail.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Hook into App Store
    // try { $('.app-store-menu-item').remove(); $('<li class="app-store-menu-item"><a href="https://community.wanikani.com/t/there-are-so-many-user-scripts-now-that-discovering-them-is-hard/20709">App Store</a></li>').insertBefore($('.navbar .dropdown-menu .nav-header:contains("Account")')); window.appStoreRegistry = window.appStoreRegistry || {}; window.appStoreRegistry[GM_info.script.uuid] = GM_info; localStorage.appStoreRegistry = JSON.stringify(appStoreRegistry); } catch (e) {}

    if (!window.wkof) {
        alert('SRS Grid requires Wanikani Open Framework.\nYou will now be forwarded to installation instructions.');
        window.location.href = 'https://community.wanikani.com/t/instructions-installing-wanikani-open-framework/28549';
        return;
    }
    window.wkof.include('ItemData, Apiv2');

    var locked_data_url = "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkAQMAAABKLAcXAAAABlBMVEX////p6emlmyooAAAAAnRSTlMAgJsrThgAAAA1SURBVDjLY3huea54DpQ4wIBgnyuewDAHSdKAAUnhuQIGJIVzHjCMmjJqyqgpo6aMmkKkKQC2XQWeSEU1BQAAAABJRU5ErkJggg==')";

    function render(json) {
        $('.progression').empty();

        //console.log(json);
        var progresses = [];
        while(json.progresses.length > 3) {
            var progress = json.progresses[0];
            var total_learned = progress.srs_level_totals.slice(1, 10).reduce((a, b) => a + b, 0); // 0 of the srs_level_totals is unlearned, so it's sliced out
            //if (progress.max === 0 || progress.gurued_total*100.0/progress.max >= 90) {
            // adding requirement that all items in the category must be learned
            if (!(progress.max === 0 || (progress.gurued_total*100.0/progress.max >= 90 && total_learned == progress.max))) {
                progresses.push(progress);
            }
            json.progresses = json.progresses.slice(1);
        }

        json.progresses = progresses.concat(json.progresses);

        var stageNames = ['', 'Apprentice I', 'Apprentice II', 'Apprentice III', 'Apprentice IV'];
        json.progresses.forEach(function(progress, j) {
            var html =
                '<div id="progress-'+progress.level+'-'+progress.type+'" class="vocab-progress">'+
                '  <h3>Level '+progress.level+' '+progress.type.charAt(0).toUpperCase() + progress.type.slice(1)+' Progression</h3>'+
                '<div class="chart" style="position:relative;">'+
                ( progress.max < 10 ? "" :
                '<div class="threshold" style="width: '+ Math.ceil(progress.max * 0.9)*100/progress.max +'%;height:100%;position:absolute;padding-right:0.5em;color:#a6a6a6;font-family:Helvetica, Arial, sans-serif;text-align:right;border-right:1px solid rgba(0,0,0,0.1);-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;-webkit-box-shadow:1px 0 0 #eee;-moz-box-shadow:1px 0 0 #eee;box-shadow:1px 0 0 #eee;text-shadow:0 1px 0 rgba(255,255,255,0.5)"><div style="position:absolute;bottom:0;right:0;">'+
                Math.ceil(progress.max * 0.9) +
                '&nbsp</div></div>' ) +

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

    window.wkof.ready('ItemData').then(() => {
        window.wkof.ready('Apiv2').then(() => {
            window.wkof.Apiv2.get_endpoint('level_progressions').then(levels => {
                var level_list = [];
                for (var id in levels) {
                    level_list.push(levels[id]);
                }
                var top_level = level_list.find(l => l.data.abandoned_at == null && l.data.passed_at == null && l.data.unlocked_at != null).data.level;
                window.wkof.ItemData.get_items('assignments').then(items => {
                    var collection = [];
                    items.forEach(item => {
                        prog = collection.find(p => p.level == item.data.level && p.type == item.object);
                        if (prog == undefined) {
                            var prog = {
                                level: item.data.level,
                                type: item.object,
                                srs_level_totals: Array(10).fill(0),
                                gurued_total: 0,
                                max: 0
                            };
                            collection.push(prog);
                        }
                        if(item.assignments != undefined && item.assignments.unlocked_at != null) {
                            prog.srs_level_totals[item.assignments.srs_stage] += 1;
                            if (item.assignments.srs_stage >= 5) {
                                prog.gurued_total += 1;
                            }
                        }
                        prog.max += 1;
                    });
                    collection = collection.filter(p => {
                        return p.level <= top_level //p.level == top_level || ( p.srs_level_totals[0] != p.max && p.gurued_total != p.max && p.level <= top_level );
                    }).sort((a, b) => {
                        var order = ['radical', 'kanji', 'vocabulary'];
                        return a.level - b.level + (order.indexOf(a.type) - order.indexOf(b.type)) / 10;
                    });
                    var json = {progresses: collection};
                    localStorage.setItem('level-progress-cache', JSON.stringify(json));
                    render(json);
        });
        }) });
    });

/*
    window.WKHelper.init(GM_info, function() {
        window.WKHelper.ajax_retry('https://wanikanitools-golang.curiousattemptbunny.com/level/progress?api_key='+window.WKHelper.api_key_v2).then(function(json) {
            localStorage.setItem('level-progress-cache', JSON.stringify(json));
            render(json);
        });
    });
*/
})();