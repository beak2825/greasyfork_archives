// ==UserScript==
// @name         WaniKani Study Review Mistakes
// @version      0.0.3
// @description  Just made a mistake in a review? Study the mnemonics again to strengthen your recall!
// @author       hitechbunny
// @include      https://www.wanikani.com/review*
// @run-at       document-end
// @grant        none
// @namespace https://greasyfork.org/users/149329
// @downloadURL https://update.greasyfork.org/scripts/36134/WaniKani%20Study%20Review%20Mistakes.user.js
// @updateURL https://update.greasyfork.org/scripts/36134/WaniKani%20Study%20Review%20Mistakes.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Hook into App Store
    try { $('.app-store-menu-item').remove(); $('<li class="app-store-menu-item"><a href="https://community.wanikani.com/t/there-are-so-many-user-scripts-now-that-discovering-them-is-hard/20709">App Store</a></li>').insertBefore($('.navbar .dropdown-menu .nav-header:contains("Account")')); window.appStoreRegistry = window.appStoreRegistry || {}; window.appStoreRegistry[GM_info.script.uuid] = GM_info; localStorage.appStoreRegistry = JSON.stringify(appStoreRegistry); } catch (e) {}

    var api_key;

    var css = '#study-mistakes {'+
        '    display: inline-block;'+
        '    padding-right: 0.7em;'+
        '}'+
        ''+
        '#study-mistakes a {'+
        '    display: inline-block;'+
        '    height: 3em;'+
        '    line-height: 3em;'+
        '    text-decoration: none;'+
        '    -webkit-box-sizing: border-box;'+
        '    -moz-box-sizing: border-box;'+
        '    box-sizing: border-box;'+
        '    vertical-align: top;'+
        '    padding: 0 1em;'+
        '    background-color: #0af;'+
        '    color: #fff;'+
        '    letter-spacing: -1px;'+
        '    text-shadow: 1px 1px 0 rgba(0,0,0,0.1);'+
        '    -webkit-border-radius: 3px 0 0 3px;'+
        '    -moz-border-radius: 3px 0 0 3px;'+
        '    border-radius: 3px 0 0 3px;'+
        '    cursor: pointer;'+
        '}'+
        ''+
        '#study-mistakes a.disabled {'+
        '    cursor: not-allowed;'+
        '    background-color: #c8c8c8;'+
        '}'+
        '#study {position:fixed; z-index:1028; width:800px; background-color:rgb(0,0,0); border-radius:8px; border:8px solid rgb(0,0,0); font-size:2em; margin-left: auto; margin-right: auto; left: 0; right: 0; top: 1.5em;}'+
        '#study_abort { position: fixed; top: 0; left: 0; bottom: 0; right: 0; z-index: 999; }'+
        '#study .swrap {  }'+
        '#study .type { text-align: center; padding-top: 1em; padding-bottom: 1em; color: #fff; font-size: 2em; }'+
        '#study .vocabulary { background-color: #a0f; }'+
        '#study .kanji { background-color: #f0a; }'+
        '#study .radical {  background-color: #00a1f1; }'+
        '#study .kanji-highlight { background-color: #f100a1; background-image: linear-gradient(to bottom, #f0a, #dd0093); background-repeat: repeat-x; color: #fff; padding: 1px 4px; }'+
        '#study .vocabulary-highlight { background-color: #a100f1; background-image: linear-gradient(to bottom, #a0f, #9300dd); background-repeat: repeat-x; color: #fff; padding: 1px 4px; }'+
        '#study .radical-highlight { background-color: #00a1f1; background-image: linear-gradient(to bottom, #0af, #0093dd); background-repeat: repeat-x; color: #fff; padding: 1px 4px; }'+
        '#study .reading-highlight { background-color: #474747; background-image: linear-gradient(to bottom, #555, #333); background-repeat: repeat-x; color: #fff; padding: 1px 4px; }'+
        '#study .detail { font-size: 0.7em; margin-top: 0.2em; padding-top: 0.2em; background-color: #eee; padding-left: 0.2em; padding-right: 0.2em; }'+
        '#study .name { width: 15%; display: inline-block; vertical-align: top; }'+ // width: 20%; float: left;}'+
        '#study .info { width: 85%; display: inline-block; margin-bottom: 4px; }'+
        '#study .info p { margin-top: 0; }'+
        '#study .word { width: 100%; text-align: center; }'+
        '#study .spacer { width: 100%; height: 0.2em; }'+
        '#study .info.hidden { color: rgba(0,0,0,0); background-color: gray; }'+
        '#study .info.hidden .reading-highlight { color: rgba(0,0,0,0); background-color: gray; background-image: initial; }'+
        '#study .info.hidden .vocabulary-highlight { color: rgba(0,0,0,0); background-color: gray; background-image: initial; }'+
        '#study .info.hidden .kanji-highlight { color: rgba(0,0,0,0); background-color: gray; background-image: initial; }'+
        '#study .info.hidden .radical-highlight { color: rgba(0,0,0,0); background-color: gray; background-image: initial; }'+
        '#study .progress {margin-bottom: 8px; height: 8px; background-color: gray;}'+
        '#study .progress .progress-bar {height: 8px; background-color: white;}'+
        '#study .progress .progress-bar.pulse { animation: pulse 1.5s ease-in-out infinite alternate; }'+
        '@keyframes pulse { 0% { box-shadow: 0px 0px 5px white; } 25% { box-shadow: 0px 0px 20px white; } 75% { box-shadow: 0px 0px 20px white; } 100% { box-shadow: 0px 0px 5px white; } }'+
        '';


    $('head').append('<style type="text/css">'+css+'</style>');
    var incorrect = $('#incorrect a[lang="ja"]');
    var index = 0;

    $('<div id="study-mistakes"><a class="'+(incorrect.length === 0 ? 'disabled' : '')+'">Study Mistakes</a></div>').insertBefore('#start-session');

    $('#study-mistakes').click(render);

    var study_html =
        '<div id="study">'+
        '  <div class="progress"><div class="progress-bar"></div></div>'+
        '    <div class="swrap">Hi!'+
        '    </div>'+
        '  </div>'+
        '</div>';

    function render() {
        index = 0;
        $('.pure-g-r').css('filter', 'blur(20px)');
        $('body').append(study_html).append('<div id="study_abort"/>');

        $('#study_abort').click(function() {
            $('.pure-g-r').css('filter', 'none');
            $('#study_abort, #study').remove();
        });

        displayNextOrDone();
    }

    function displayNextOrDone() {
        if (index === incorrect.length) {
            $('.pure-g-r').css('filter', 'none');
            $('#study_abort, #study').remove();
            index = 0;
            return;
        }

        $('.progress-bar').css('width', (4*index*100.0 / (4*incorrect.length))+'%');

        var item = incorrect[index];
        ajax_retry(item.href).then(function(html) {
            var doc = jQuery( "<div>" ).append( jQuery.parseHTML( html ) );
            var japanese = doc.find('header h1 span span').text();
            var type = doc.find('header h1 span').attr('class').split('-')[0];
            var english = doc.find('header h1').text().split(japanese)[1].trim();
            var moreEnglish = doc.find('.alternative-meaning p').html();
            if (moreEnglish) {
                english += ', '+moreEnglish;
            }
            var reading = doc.find('.'+type+'-reading p').text().trim();
            if (!reading) {
                reading = doc.find('h2:contains("Readings")').parent().find('div.span4:not(.muted-content) p').text().trim();
            }
            var meaningExplanation = Array.prototype.join.call(doc.find('h2:contains("Meaning Explanation"),h2:contains("Meaning Mnemonic"),h2:contains("Name Mnemonic")').parent().find('p').map(function() { return '<p>'+this.innerHTML+'</p>'; }), '');
            var readingExplanation = Array.prototype.join.call(doc.find('h2:contains("Reading Explanation"),h2:contains("Reading Mnemonic")').parent().find('p').map(function() { return '<p>'+this.innerHTML+'</p>'; }), '');
            console.log(japanese);
            console.log(type);
            console.log(english);
            console.log(reading);
            console.log(meaningExplanation);
            console.log(readingExplanation);
            $('.swrap').empty();
            html = '<div class="type '+type+'">'+japanese+'</div>'+
                '<div class="detail">'+
                '<div class="name">'+(type == 'radical' ? 'Name' : 'Meaning')+'</div><div class="info hidden">'+meaningExplanation+'</div>'+
                '<div class="info word hidden"><p>'+english+'</p></div>';
            if (readingExplanation) {
                html += '<div class="name">Reading</div><div class="info hidden">'+readingExplanation+'</div>'+
                    '<div class="info word hidden"><p>'+reading+'</p></div>';
            }
            html += '</div>';
            $('.swrap').append(html);
//            $('#study .info.hidden').on('click', function() { $(this).removeClass('hidden'); });
        });
        index++;
    }

    $('body').on('keypress', function(e) {
        if (e.charCode == 13) {
            var hidden = $('#study .hidden');
            if (hidden.length > 0) {
                $(hidden[0]).removeClass('hidden');
                $('.progress-bar').css('width', ((4*index -hidden.length+1)*100.0 / (4*incorrect.length))+'%');
                if (hidden.length === 1 && index == incorrect.length) {
                    $('#study .progress-bar').addClass('pulse');
                }
            } else {
                displayNextOrDone();
            }
        }
    });

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
})();