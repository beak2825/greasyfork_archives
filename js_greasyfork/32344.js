// ==UserScript==
// @name        WaniKani SRS Level Progress
// @namespace   hitechbunny
// @description Review schedule explorer for WaniKani
// @version     1.2.2
// @include     https://www.wanikani.com/dashboard
// @include     https://www.wanikani.com/
// @include     https://www.wanikani.com/review
// @run-at      document-end
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/32344/WaniKani%20SRS%20Level%20Progress.user.js
// @updateURL https://update.greasyfork.org/scripts/32344/WaniKani%20SRS%20Level%20Progress.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Hook into App Store
    try { $('.app-store-menu-item').remove(); $('<li class="app-store-menu-item"><a href="https://community.wanikani.com/t/there-are-so-many-user-scripts-now-that-discovering-them-is-hard/20709">App Store</a></li>').insertBefore($('.navbar .dropdown-menu .nav-header:contains("Account")')); window.appStoreRegistry = window.appStoreRegistry || {}; window.appStoreRegistry[GM_info.script.uuid] = GM_info; localStorage.appStoreRegistry = JSON.stringify(appStoreRegistry); } catch (e) {}

    if (window.location.pathname == '/review') {
        console.log('Attempting to cache srs/status.');
        get_api_key().then(function() {
            console.log('v2 api_key is', api_key);
            if (api_key) {
                ajax_retry('https://wanikanitools-golang.curiousattemptbunny.com/srs/status?api_key='+api_key, 3, 120000).then(function(json) {
                    localStorage.setItem('srs-level-progress-cache', JSON.stringify(json));
                    console.log('Cached srs/status!');
                });
            }
        });
        return;
    }

    var api_key;

    var css =
        '.srs-innner-progress {'+
        '    position: relative;'+
        '    color: #fff;'+
        '}'+
        '.srs-progress .srs-innner-progress span.srs-inner-progress-count {'+
        '    display: inline;'+
        '    font-size: 15px;'+
        '    font-weight: initial;'+
        '    text-shadow: initial;'+
        '}'+
        '.dashboard section.srs-progress span {'+
        '    margin-bottom: 4px;'+
        '}'+
        '.dashboard section.srs-progress .srs-innner-progress .leech-count .leech-breakdown {'+
        '    background-color: black;'+
        '    font-size: 0.8em;'+
        '    font-weight: 100;'+
        '    opacity: 0.75;'+
        '    display: none;'+
        '}'+
        '.dashboard section.srs-progress .srs-innner-progress .leech-count {'+
        '    background-color: black;'+
        '    position: absolute;'+
        '    right: -1.0em;'+
        '    bottom: -2.5em;'+
        '    padding-left: 0.3em;'+
        '    padding-right: 0.3em;'+
        '    font-size: 1em;'+
        '    opacity: 0.25;'+
        '    font-weight: 100;'+
        '}'+
        '.dashboard section.srs-progress .srs-innner-progress .leech-count a {'+
        '    color: white;'+
        '}'+
        '.dashboard section.srs-progress li:hover .srs-innner-progress .leech-count {'+
        '    opacity: 1.0;'+
        '}'+
        '.dashboard section.srs-progress li:hover .srs-innner-progress .leech-count .leech-breakdown {'+
        '    display: inline;'+
        '}'+
        '';

    var head = document.getElementsByTagName('head')[0];
    if (head) {
        var style = document.createElement('style');
        style.setAttribute('type', 'text/css');
        style.textContent = css;
        head.appendChild(style);
    }

    ['apprentice', 'guru', 'master', 'enlightened', 'burned'].forEach(function(level, _) {
        $('li#'+level+' span').after('<div class="srs-innner-progress"><span class="srs-inner-progress-count">&nbsp;</span></div>');
    });

    //-------------------------------------------------------------------
    // Fetch a document from the server.
    //-------------------------------------------------------------------
    function ajax_retry(url, retries, timeout) {
        //console.log(url, retries, timeout);
        retries = retries || 3;
        timeout = timeout || 3000;
        function action(resolve, reject) {
            $.ajax({
                url: url,
                timeout: timeout
            })
            .done(function(data, status){
                //console.log(status, data);
                if (status === 'success') {
                    resolve(data);
                } else {
                    //console.log("done (reject)", status, data);
                    reject();
                }
            })
            .fail(function(xhr, status, error){
                if (xhr.status == 401) {
                    console.log("Unauthorized. Clearing api key from local storage.");
                    delete localStorage.apiKey_v2;
                    reject();
                }
                //console.log(status, error);
                if ((status === 'error' || status === 'timeout') && --retries > 0) {
                    //console.log("fail", status, error);
                    action(resolve, reject);
                } else {
                    reject();
                }
            });
        }
        return new Promise(action);
    }

    //-------------------------------------------------------------------
    // Fetch API key from account page.
    //-------------------------------------------------------------------
    function get_api_key() {
        return new Promise(function(resolve, reject) {
            api_key = localStorage.getItem('apiKey_v2');
            if (typeof api_key === 'string' && api_key.length == 36) return resolve();

            // status_div.html('Fetching API key...');
            ajax_retry('/settings/account').then(function(page) {

                // --[ SUCCESS ]----------------------
                // Make sure what we got is a web page.
                if (typeof page !== 'string') {return reject();}

                // Extract the user name.
                page = $(page);

                // Extract the API key.
                api_key = page.find('#user_api_key_v2').attr('value');
                if (typeof api_key !== 'string' || api_key.length !== 36) {
                    return reject(new Error('generate_apikey'));
                }

                localStorage.setItem('apiKey_v2', api_key);
                resolve();

            },function(result) {
                // --[ FAIL ]-------------------------
                reject(new Error('Failed to fetch API key!'));

            });
        });
    }

    var update = function(json) {
        $('.srs-innner-progress').remove();
        $('.srs-inner-progress-count').remove();
        $('.leech-count').remove();
        $('.worst-leeches').remove();

        var level_counts = {};
        var srs_numeric_to_inner_level = [0, 1, 2, 3, 4, 1, 2, 1, 1, 1];
        var srs_to_number_of_inner_levels = {
            apprentice: 4,
            guru: 2
        };
        ['apprentice', 'guru'].forEach(function(level, _) {
            var level_data = json.levels[level];
            var missing_data = false;
            var number_of_inner_levels = srs_to_number_of_inner_levels[level] || 1;
            var html = '';
            var running_total = 0;
            for(var inner_level = 1; inner_level <= number_of_inner_levels; inner_level++) {
                var total = level_data.srs_level_totals[inner_level-1];
                running_total += total;
                if (inner_level == number_of_inner_levels) {
                    var true_total = parseInt($('.srs-progress li#'+level+' span').html());
                    var delta = true_total - running_total;

                    // assume that the missing items are at the most advanced level
                    if (delta !== 0) {
                        //total += delta;
                        missing_data = true;
                    }
                }
                if (html) {
                    html += '&nbsp;/&nbsp;';
                } else {
                    html = '<div class="srs-innner-progress">';
                }
                html += '<span class="srs-inner-progress-count">'+total+(missing_data ? '.' : '')+'</span>';
            }
            html += '</div>';
            $('.srs-progress li#'+level+' span').after(html);
        });
        ['master', 'enlightened', 'burned'].forEach(function(level, _) {
            $('li#'+level+' span').after('<div class="srs-innner-progress"><span class="srs-inner-progress-count">&nbsp;</span></div>');
        });
        json.levels.order.forEach(function(level) {
            var leech_total = json.levels[level].leeches_total;
            if (leech_total) {
                var html = '<span class="leech-count" title="'+leech_total+' '+(leech_total > 1 ? 'leeches' : 'leech')+'">'+
                    '<a href="https://wanikanitools-golang.curiousattemptbunny.com/leeches?sort_by=srs&api_key='+api_key+'#'+level+'" target="_blank">';
                if (level == 'apprentice' || level == 'guru') {
                    html += '<span class="leech-breakdown">(';
                    json.levels[level].srs_level_leeches_totals.forEach(function(subtotal, i) {
                        if (i>0) {
                            html += ' / ';
                        }
                        html += subtotal;
                    });
                    html += ')&nbsp</span>';
                }
                html += leech_total+
                    '</a></span>';
                $('.srs-progress li#'+level+' .srs-innner-progress').append(html);
            }
        });

        var review_html = '<section class="worst-leeches kotoba-table-list dashboard-sub-section">'+
            '<h3 class="small-caps">Worst Leeches List</h3>'+
            '<table>'+
            '<tbody>';

        if (!json.review_order || json.review_order.length === 0) {
            review_html += '<tr class="none-available"><td><div><i class="icon-ok"></i></div>Turtles are healthy.</td></tr>';
        } else {
            json.review_order.forEach(function(review_leech) {
                review_html += '<tr id="'+review_leech.subject_type+'-'+review_leech.subject_id+'"><td><a href="/'+review_leech.subject_type+'/'+review_leech.name+'"><span lang="ja">'+review_leech.name+'</span><span class="pull-right">'+review_leech.worst_score.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })+'</span></a></td></tr>';
            });
        }

        review_html += '</tbody></table>';

        if (!json.review_order || json.review_order.length === 0) {
            review_html += '<div class="see-more"><a class="small-caps">&nbsp;</a></div>';
        } else {
            review_html += '<div class="see-more">'+
                '<a class="small-caps" href="https://wanikanitools-golang.curiousattemptbunny.com/leeches?sort_by=wrong&api_key='+api_key+'" target="_blank">See More Leeches...</a>'+
                '</div>';
        }

        review_html += '</section>';

        $('.low-percentage').after(review_html);
        $('.low-percentage').css('cssText', 'display: none !important'); // can't use hide() because of Dark Breeze css uses !important
    };
    window.raw_user_data = null;
    var cached_json = localStorage.getItem('srs-level-progress-cache');
    if (cached_json) {
        update(JSON.parse(cached_json));
    }
    get_api_key().then(function() {
        console.log('v2 api_key is', api_key);
        if (api_key) {
            ajax_retry('https://wanikanitools-golang.curiousattemptbunny.com/srs/status?api_key='+api_key, 3, 120000).then(function(json) {
                localStorage.setItem('srs-level-progress-cache', JSON.stringify(json));
                update(json);
            });
        }
    });
})();