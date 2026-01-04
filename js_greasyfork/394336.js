// ==UserScript==
// @name         Spam MP JVC
// @namespace    http://www.jeuxvideo.com/forums/0-51-0-1-0-1-0-blabla-18-25-ans.htm
// @version      0.0.3
// @description  MP spam JVC dans navigateur 
// @author       Kratos
// @match        http://www.jeuxvideo.com/*
// @grant        none
// @require      http://code.jquery.com/jquery-latest.js

// @downloadURL https://update.greasyfork.org/scripts/394336/Spam%20MP%20JVC.user.js
// @updateURL https://update.greasyfork.org/scripts/394336/Spam%20MP%20JVC.meta.js
// ==/UserScript==


//COOKIE
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // CommonJS
        factory(require('jquery'));
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {

    var pluses = /\+/g;

    function encode(s) {
        return config.raw ? s : encodeURIComponent(s);
    }

    function decode(s) {
        return config.raw ? s : decodeURIComponent(s);
    }

    function stringifyCookieValue(value) {
        return encode(config.json ? JSON.stringify(value) : String(value));
    }

    function parseCookieValue(s) {
        if (s.indexOf('"') === 0) {
            // This is a quoted cookie as according to RFC2068, unescape...
            s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
        }

        try {
            // Replace server-side written pluses with spaces.
            // If we can't decode the cookie, ignore it, it's unusable.
            // If we can't parse the cookie, ignore it, it's unusable.
            s = decodeURIComponent(s.replace(pluses, ' '));
            return config.json ? JSON.parse(s) : s;
        } catch(e) {}
    }

    function read(s, converter) {
        var value = config.raw ? s : parseCookieValue(s);
        return $.isFunction(converter) ? converter(value) : value;
    }

    var config = $.cookie = function (key, value, options) {

        // Write

        if (value !== undefined && !$.isFunction(value)) {
            options = $.extend({}, config.defaults, options);

            if (typeof options.expires === 'number') {
                var days = options.expires, t = options.expires = new Date();
                t.setTime(+t + days * 864e+5);
            }

            return (document.cookie = [
                encode(key), '=', stringifyCookieValue(value),
                options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
                options.path    ? '; path=' + options.path : '',
                options.domain  ? '; domain=' + options.domain : '',
                options.secure  ? '; secure' : ''
            ].join(''));
        }

        // Read

        var result = key ? undefined : {};

        // To prevent the for loop in the first place assign an empty array
        // in case there are no cookies at all. Also prevents odd result when
        // calling $.cookie().
        var cookies = document.cookie ? document.cookie.split('; ') : [];

        for (var i = 0, l = cookies.length; i < l; i++) {
            var parts = cookies[i].split('=');
            var name = decode(parts.shift());
            var cookie = parts.join('=');

            if (key && key === name) {
                // If second argument (value) is a function it's a converter...
                result = read(cookie, value);
                break;
            }

            // Prevent storing a cookie that we couldn't decode.
            if (!key && (cookie = read(cookie)) !== undefined) {
                result[name] = cookie;
            }
        }

        return result;
    };

    config.defaults = {};

    $.removeCookie = function (key, options) {
        if ($.cookie(key) === undefined) {
            return false;
        }

        // Must not alter options, thus extending a fresh object...
        $.cookie(key, '', $.extend({}, options, { expires: -1 }));
        return !$.cookie(key);
    };

}));

//var RandomTitles=["Petit lien du serveur Discord","Un endroit pour ceux qui s'ennuient","lien du Discord de JVC","Une kheyette sur discord","Le discord de l'élite","Voici la 9/10","Le discord des khey","Jvc en sueur","Résistance contre le 410","poti lien du discord de jvc","La modération impuissante face à ce discord"];
//var RandomTitles=["un chat pokemon","Un chat pokemon pour ceux qui s'ennuient","lien du chat de pokemon","Une kheyette sur discord","bordel ce chat pokemon","ce chat met jvc en pls","Le chat des pokemons","Jvc en sueur","Résistance des pokemons","poti lien du site de pokemin","La modération impuissante face à ce site","je t'envois juste un mp pour"];

var RandomTitles = ["Tuto : miner du loultcoin","Tuto: se faire mass thune avec un glitch crypto, le liens de la kheyette qui se fait prendre","Arrondir ses fins de mois avec loult.family","si t'en a marre de l'esprit JVC, voici une communauté d'anciens qui veulent passer à la maturité","Rejoins la meilleure communauté de jvc"];


//COOKIE
var baseLink = "http://www.jeuxvideo.com/forums/0-51-0-1-0-1-0-blabla-18-25-ans.htm";
//var baseLink = "http://www.jeuxvideo.com/forums/0-50-0-1-0-1-0-blabla-15-18-ans.htm";
var privateMessageTitle = RandomTitles[Math.floor(Math.random()*RandomTitles.length)];
var privateMessageContent = "Salut les gars voici le lien  \n https://loult.family/ \n http://www.noelshack.com/2019-27-5-1562339228-147904-thumb.png";
var regexURLTopic = /http:\/\/www.jeuxvideo.com\/forums\/\d+-\d+-\d+-\d+-\d+-\d+-\d-[\w-]+.htm/;
var regexPrivateMessage = /http:\/\/www.jeuxvideo.com\/messages-prives\/message.php\?id=\d+/;
var privateMessageBaseLink = "http://www.jeuxvideo.com/messages-prives/nouveau.php?all_dest=";

var alreadySentNicknames;
var privateMessageReceivers;



if($.cookie("privateMessageReceivers") == undefined) {
    $.cookie("privateMessageReceivers", "");
}

if($.cookie("alreadySentNicknames") == undefined) {
    $.cookie("alreadySentNicknames", "");
}

(function() {
    'use strict';

    function random(min, max) {
        return Math.floor(Math.random() * (max - min) ) + min;
    }

    function getPrivateMessageLink() {
        var resultLink = privateMessageBaseLink;
        var privateMessageReceivers = $.cookie("privateMessageReceivers").split(";");

        for(var i = 0; i < privateMessageReceivers.length; i++) {
            resultLink += privateMessageReceivers[i] + ';'
        }
        console.log(resultLink);
        return resultLink;
    }

    function getNicknames() {
        var ourNickname = document.getElementsByClassName("account-pseudo")[0].innerText;
        var getNicknames = document.getElementsByClassName("xXx bloc-pseudo-msg text-user");

        for(var i = 0; i < getNicknames.length; i++) {
            var presentNickname = getNicknames[i].innerText;
            privateMessageReceivers = $.cookie("privateMessageReceivers").split(";");
            alreadySentNicknames = $.cookie("alreadySentNicknames").split(";");
            if(ourNickname !== presentNickname && privateMessageReceivers.length < 35) {
                if(!privateMessageReceivers.includes(presentNickname) && !alreadySentNicknames.includes(presentNickname)) {
                    if(privateMessageReceivers.length == 0) {
                        $.cookie("privateMessageReceivers", $.cookie("privateMessageReceivers") + presentNickname);
                        $.cookie("alreadySentNicknames", $.cookie("alreadySentNicknames") + presentNickname);
                    } else {
                        $.cookie("privateMessageReceivers", $.cookie("privateMessageReceivers") + ";" + presentNickname);
                        $.cookie("alreadySentNicknames", $.cookie("alreadySentNicknames") + ";" + presentNickname);
                    }
                }
            }
        }
    }

    function getRandomTopic() {
        var actualURL = window.location.href;
        if (actualURL === baseLink) {
            var selectedTopic = document.getElementsByClassName("lien-jv topic-title")[random(4, 25)];
            selectedTopic.click();
        } else if(actualURL.match(regexURLTopic)) {
            getNicknames();
            privateMessageReceivers = $.cookie("privateMessageReceivers").split(";");
            console.log(privateMessageReceivers.length);
            if(privateMessageReceivers.length < 35) {
                location.replace(baseLink);
            } else {
                var privateMessagelink = getPrivateMessageLink();
                console.warn(privateMessagelink);
                $.removeCookie("privateMessageReceivers");
                location.replace(privateMessagelink);
            }
        } else if(actualURL.match(regexPrivateMessage)) {
            location.replace(baseLink);
        }
        else {
            document.getElementById("conv_titre").value = privateMessageTitle;
            document.getElementById("message").value = privateMessageContent;
            document.getElementsByClassName("btn btn-poster-msg js-post-message")[0].click();
        }
    }

    setInterval(getRandomTopic(), 1000);

})();