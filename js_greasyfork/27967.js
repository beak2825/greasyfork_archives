// ==UserScript==
// @name        Wanikani Forums Global Framework
// @namespace   rfindley
// @description A framework for global script services on Wanikani forums
// @version     1.0.3
// @copyright   2017+, Robin Findley
// @license     MIT; http://opensource.org/licenses/MIT
// ==/UserScript==

if (window.wkf_global === undefined) window.wkf_global = {};

(function(gobj) {
    if (gobj.already_loaded === true) return;
    gobj.already_loaded = true;

    var settings_url = '/scripts/global';

    var html =
        '<div class="settings">'+
        '  <h1>Global script settings</h1>'+
        '  <p>'+
        '    <label>Public API Key</label>'+
        '    <input id="apikey" value="" placeholder="Enter your API Key here" type="text" class="span6">'+
        '    <span class="note">(You can find it [<a href="https://www.wanikani.com/settings/account/" target="_">here</a>])</span>'+
        '  </p>'+
        '  <p>'+
        '    <label></label>'+
        '    <input id="save" type="submit" name="commit" value="Save" class="btn">'+
        '    <span id="save_status" class="note"></span>'+
        '  </p>'+
        '  <h1>Individual Script Settings</h1>'+
        '  <div id="script_list">'+
        '  </div>'+
        '</div>'+
        '';

    var css =
        '.settings > h1 {padding-bottom: 0.2em; margin-bottom:0.5em; border-bottom:1px solid black;}'+
        '.settings > h1:not(:first-child) {margin-top:40px;}'+
        '.settings label {display:inline-block; text-align:right; padding-right:8px; width:120px;}'+
        '.settings .note {color:#aaa; margin-left:8px; font-size:0.9em;}'+
        '#save_status {color:#c22;}'+
        '.settings a {color:#c22;}'+
        '.settings .btn {'+
        '  border-color: rgba(0,0,0,0.15) rgba(0,0,0,0.15) rgba(0,0,0,0.25);'+
        '  color: #555;'+
        '  cursor: pointer;'+
        '  text-shadow: 0 1px 1px rgba(255,255,255,0.75);'+
        '  background-color: #f5f5f5;'+
        '  background-image: linear-gradient(to bottom, #fff, #e6e6e6);'+
        '  border: 1px solid #bbbbbb;'+
        '  border-radius: 4px;'+
        '  box-shadow: inset 0 1px 0 rgba(255,255,255,0.2), 0 1px 2px rgba(0,0,0,0.05);'+
        '  line-height: 1em;'+
        '}'+
        '';

    // Load jquery (if not already).
    function load_jquery() {
        return new Promise(function(resolve, reject){
            if (typeof jQuery !== 'undefined') return resolve();

            function jquery_loaded(){
                resolve();
            }

            var headTag = document.getElementsByTagName("head")[0];
            var jqTag = document.createElement('script');
            jqTag.type = 'text/javascript';
            jqTag.src = 'https://code.jquery.com/jquery-3.1.1.min.js';
            jqTag.onload = jquery_loaded;
            headTag.appendChild(jqTag);
        });
    }

    // Load
    if (window.location.pathname.match('^/scripts/') !== null) {
        document.getElementById('main-outlet').innerHTML = '';
        var promise = load_jquery();
        if (window.location.pathname === settings_url) {
            promise.then(function(){
                $('head').append('<style type="text/css">'+css+'</style>');
                $('#main-outlet').html(html);
                var apikey = localStorage.getItem('apikey');
                if (apikey !== null) {
                    $('#apikey').val(apikey);
                }
                $('#save').on('click', function(){
                    var apikey = $('#apikey').val();
                    if (apikey.match(/^[0-9a-f]{32}$/) !== null) {
                        localStorage.setItem('apikey', apikey);
                        $('#save_status').text('Saved!').fadeIn(0).delay(750).fadeOut(750);
                    } else {
                        alert('API Key is not valid!');
                    }
                });
                $('body').on('add_script', function(e){
                    var data = e.detail;
                    $('#script_list').append('<p class="partner_script"><a href="'+data.url+'">'+data.name+'</a></p>');
                    $('.settings .partner_script').sort(function(a,b){
                        return $(a).text().localeCompare($(b).text());
                    }).appendTo($('#script_list'));
                });
                document.getElementsByTagName('body')[0].dispatchEvent(new Event('global_settings_done'));
            });
        }
    }

    gobj.add_script = function(name, url) {
        if (window.location.pathname === '/scripts/global') {
            document.getElementsByTagName('body')[0].addEventListener('global_settings_done', function(){
                document.getElementsByTagName('body')[0].dispatchEvent(new CustomEvent('add_script', {detail:{name:name, url:url}}));
            });
        }
    };

    gobj.get_apikey = function(force_renew) {
        if (force_renew === true) localStorage.removeItem('apikey');
        var apikey = localStorage.getItem('apikey') || '';
        if (apikey.match(/^[0-9a-f]{32}$/) !== null) return apikey;
        if (window.location.pathname !== '/scripts/global') window.location.pathname = '/scripts/global';
        return null;
    };

    gobj.query_api = function(partial_url) {
        return new Promise(function(resolve, reject){
            var apikey = localStorage.getItem('apikey');
            if (apikey.match(/^[0-9a-f]{32}$/) === null) return reject();
            $.getJSON('https://www.wanikani.com/api/user/'+apikey+partial_url, function(json){
                if (json.error !== undefined) return reject(json.error);
                var current_user = $('#current-user img').attr('title');
                var api_user = json.user_information.username;
                if (current_user !== api_user) gobj.get_apikey(true /* force_renew */);
                resolve(json);
            });
        });
    };

    gobj.goto_settings = function(reason) {
        if (window.location.pathname !== '/scripts/global') window.location.pathname = '/scripts/global';
    };

})(window.wkf_global);
