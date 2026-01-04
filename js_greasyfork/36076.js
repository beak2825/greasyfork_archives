// ==UserScript==
// @name         WaniKani Levels By Stage
// @version      0.0.2
// @description  See what level you are at for each stage (Apprentice/Guru/Master/Englightened/Burned).
// @author       hitechbunny
// @include      https://www.wanikani.com/
// @include      https://www.wanikani.com/dashboard
// @run-at       document-end
// @grant        none
// @namespace https://greasyfork.org/users/149329
// @downloadURL https://update.greasyfork.org/scripts/36076/WaniKani%20Levels%20By%20Stage.user.js
// @updateURL https://update.greasyfork.org/scripts/36076/WaniKani%20Levels%20By%20Stage.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Hook into App Store
    try { $('.app-store-menu-item').remove(); $('<li class="app-store-menu-item"><a href="https://community.wanikani.com/t/there-are-so-many-user-scripts-now-that-discovering-them-is-hard/20709">App Store</a></li>').insertBefore($('.navbar .dropdown-menu .nav-header:contains("Account")')); window.appStoreRegistry = window.appStoreRegistry || {}; window.appStoreRegistry[GM_info.script.uuid] = GM_info; localStorage.appStoreRegistry = JSON.stringify(appStoreRegistry); } catch (e) {}

    var api_key;

    var cached_json = localStorage.getItem('level-progress-cache');
    if (cached_json) {
        render(JSON.parse(cached_json));
    }

    get_api_key().then(function() {
        ajax_retry('https://wanikanitools-golang.curiousattemptbunny.com/level/progress?api_key='+api_key).then(function(json) {
            localStorage.setItem('level-progress-cache', JSON.stringify(json));
            render(json);
        });
    });

    function render(json) {
        console.log(json);

        if (!json.stage_levels) {
            return;
        }

        var html = '<section class="srs-progress">'+
            '  <ul>';

        ['Apprentice', 'Guru', 'Master', 'Enlightened', 'Burned'].forEach(function(stage) {
            html += '<li style="box-shadow: initial; padding-top: 10px; padding-bottom: 6px;">'+
                '<span style="font-size: 16px; display: initial;">Level '+(json.stage_levels[stage].level == 60 ? 60 : json.stage_levels[stage].level + 1) +'</span><br>'+
                '<span style="display: initial; font-weight: initial; font-size: 16px;">'+(json.stage_levels[stage].percentage_next_level*100).toFixed(0)+'%</span>'+
                '</li>';
        });

        html += '  </ul>'+
            '</section>';

        var previous = $('.srs-progress')[1];
        if (previous) {
            $(previous).remove();
        }
        $(html).insertAfter('.srs-progress');
    }

    //-------------------------------------------------------------------
    // Fetch a document from the server.
    //-------------------------------------------------------------------
    function ajax_retry(url, options) {
        //console.log(url, retries, timeout);
        options = options || {};
        var retries = options.retries || 3;
        var timeout = options.timeout || 3000;
        var headers = options.headers || {};
        var method = options.method || 'GET';
        var data = options.data || undefined;
        var cache = options.cache || false;

        function action(resolve, reject) {
            $.ajax({
                url: url,
                method: method,
                timeout: timeout,
                headers: headers,
                data: data,
                cache: cache
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
})();