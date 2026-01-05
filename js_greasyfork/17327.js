// ==UserScript==
// @name        Twitch Taunts
// @description This Skript is currently heavy under construction! It allows users to play taunts by writing down the taunt numbers. yet only aoe (+ some other) work
// @author      Yourtime
// @include     *twitch.tv/*
// @version     0.9.13
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_log
// @namespace   https://greasyfork.org/users/31368
// @require     http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/17327/Twitch%20Taunts.user.js
// @updateURL https://update.greasyfork.org/scripts/17327/Twitch%20Taunts.meta.js
// ==/UserScript==

// ---- PREFERENCES -----
var _volume = GM_getValue("volume",0.25);        // volume for the taunts (max 1.00)
var _lang = GM_getValue("lang","en");            // default language (other de/en/es/jp/it/fr/zh/ko)
var _timeout = GM_getValue("timeout",50);        // default timeout for each taunt (in ms)
var _tstrict = GM_getValue("strict",true);        // strict = true, only accept taunts written at the beginning of message, 

// utilities
(function ($) {
    $.fn.proceed = function () {
        $('<div/>', {
            class: 'proceed',
            style: 'hidden'
        }).appendTo(this);
    };
    $.fn.isproceed = function () {
        return $(this).find('.proceed').length > 0;
    };
}(jQuery));

String.prototype.paddingLeft = function (paddingValue) {
    return String(paddingValue + this).slice( - paddingValue.length);
};

function getValidLang(value,default_lang) {
    var lang = (typeof value != 'undefined') ? value : _lang;
    return $.inArray(lang,all_langs) != -1 ? lang : 'undefined';
}

function log(obj){
    GM_log("twitch_taunts:" + obj);
}

var cmds = {
    'help': function (args) {
        return 0;
    },
    'strict': function (args) {
        return 0;
    },
    'volume': function (args) {
        return 0;
    },
    'mute': function (args) {
        return 0;
    }
};

// main script
$(window).load(function () {
    log('page is loaded');
    var taunt =  _tstrict ?  /^([a-z]+)?(\d\d?\d?)/i : /([a-z]+)?(\d\d?\d?)/i ;
   // Unrecognized command: /mute
    var cmd = /Unrecognized\s+command:\s+\/(\w+)\s+(\w+)/i;
    all_langs = ["de", "en", "es", "fr", "it", "jp", "ko", "zh", "ea"];
    log('using taunt:' + taunt + " " + _tstrict);
    setInterval(function () {
        var messages = $('.chat-line');
        $('.message', messages).each(function () {
            var _this = $(this);
            var _msg = $.trim(_this.text());
//log(_msg);
            if (taunt.test(_msg) && !$(this).isproceed()) {
                log("recognized taunt");
                $(this).proceed();
                var groups = taunt.exec(_msg);
                var lang = getValidLang(groups[1]);
                if(lang != 'undefined'){
                    var text = groups[2].paddingLeft(groups[2].length > 2 ? '000' : '00');
                    log(text + " " + groups[2]);
                    var audio = new Audio('http://yourtime.bplaced.net/aoefun/' + lang  + '/taunt/' + text + '.mp3', '.mp3');
                    audio.volume = _volume;
                    audio.play();
                }
            } else if(cmd.test(_msg)){
                log('recognized cmd');
                var _groups = cmd.exec(_msg);
                cmd[_groups[1]](_groups[2]);
            }
        });
    }, 200);
});

