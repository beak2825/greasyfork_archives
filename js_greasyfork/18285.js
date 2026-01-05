// ==UserScript==
// @name        gleam.io helper
// @namespace   https://greasyfork.org/users/726
// @description gleam.io
// @author      Deparsoul
// @include     https://gleam.io/*
// @include     http*://steamcommunity.com/groups/*
// @icon        https://gleam.io/favicon.ico
// @version     20170101
// @run-at      document-end
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/18285/gleamio%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/18285/gleamio%20helper.meta.js
// ==/UserScript==

var regex_steam_group = /\/\/steamcommunity\.com\/groups\//;

if(location.href.match(regex_steam_group)){
    if(location.hash == '#gih_join_steam_group'){
        gih_log('auto join steam group');
        var form = jQuery('#join_group_form');
        jQuery.post(form.attr('action'), form.serialize(), function(){
            window.close();
        });
    }
    return;
}

function gih_process(){
    if($('.entry-content').hasClass('ng-hide')){
        gih_log('ended');
        return;
    }
    setTimeout(gih_process, gih_rand());
    var entry = $('.entry-method.expanded');
    if(entry.length!=1)
        return;
    $('a.btn-large:not(.gih_processed)', entry).each(function(){
        var btn = $(this);
        var href = btn.attr('href');
        if(regex_steam_group.test(href)){
            window.open(href.replace(/#.*/g, '')+'#gih_join_steam_group');gih_log('need to join steam group');
        }
        btn.addClass('gih_processed');
        btn.attr('href', '');btn[0].click();btn.attr('href', href);gih_log('click button');
    });
    if($('.btn:contains("Continue"):not(:disabled)', entry).click().length)
        gih_log('click continue');
}

function gih_entry(){
    if($('.entry-content').hasClass('ng-hide')){
        gih_log('ended');
        return;
    }
    setTimeout(gih_entry, gih_rand());
    if($('.enter-link.loading').length){
        gih_log('still loading');
        return;
    }
    var entry = $('.entry-method.expanded');
    if(entry.length>0){
        var count = entry.data('gih_count')||0;
        entry.data('gih_count', 1+count);
        if(count>2){
            $('.fa-chevron-down', entry).click();gih_log('hide entry');
        }
    }else{
        entry = $('.entry-method:not(.completed-entry-method):not(.gih_processed)').filter(function(){return $(this).height()>0;}).eq(0);
        if(entry.length!=1)
            return;
        var scope = angular.element(entry).scope();
        var cookie = '';
        switch(scope.entry_method.entry_type) {
            case "youtube_watch":
            case "vimeo_watch":
                scope.entry_method.timePassed = 1;
                gih_log('set watched');
                break;
            case "custom_action":
                console.log(scope.entry_method.config6);
                if(scope.entry_method.config6){
                    var answer = scope.entry_method.config6.split(/[()|]/);
                    console.log(answer);
                    if(answer.length>2){
                        answer = answer[1];
                        if(!answer.match(/[\\\[^*+?{]/)){
                            console.log(answer);
                            var input = entry.find('input');
                            if(input.length==1)
                                input.val(answer).focus();
                        }
                    }
                }
                gih_log('question answered');
                break;
            case "steam_join_group":
                cookie = 'J';
                break;
            case "steam_play_game":
                cookie = 'P';
                break;
        }
        if(cookie){
            $.cookie("D-" + scope.entry_method.id, cookie, {
                path: "/",
                expires: 7
            });
            gih_log('set cookie '+cookie);
        }
        entry.addClass('gih_processed');
        $('.enter-link', entry).click();gih_log('click entry');
    }
}

function gih_log(msg){
    console.log('%c [gleam.io helper] ', 'background:linear-gradient(to right,#f36a22,#f3852f,#f2c32e,#cbdc38,#b5d66d,#69c5e4,#6d9fd5)', msg);
}

function gih_rand(a, b){
    a = a || 3000;
    b = b || 4000;
    var rand = Math.floor(Math.random()*(b-a))+a;
    //gih_log(rand);
    return rand;
}

gih_process();
gih_entry();