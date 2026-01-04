// ==UserScript==
// @run-at document-end
// @name         EM Role Descriptors
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Tags the names and aliases of roles to make the game easier to learn.
// @author       nearbeer
// @contributor  Shwartz99
// @match        https://epicmafia.com/game*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/37782/EM%20Role%20Descriptors.user.js
// @updateURL https://update.greasyfork.org/scripts/37782/EM%20Role%20Descriptors.meta.js
// ==/UserScript==

var roles = {};
var aliases = {
    119: [ "nilla" ],
    120: [ "doc" ],
    5945: [ "surg" ],
    121: [ "bg" ],
    230: [ "det" ],
    2210: [ "journ", "journo" ],
    166: [ "mort" ],
    5927: [ "path", "patho" ],
    128: [ "vig", "vigil" ],
    349: [ "sher" ],
    2090: [ "dep" ],
    945: [ "sw" ],
    6302: [ "civ" ],
    15739: [ "pres" ],
    131: [ "bp" ],
    2361: [ "invis" ],
    568: [ "gov" ],
    2372: [ "tele" ],
    1183: [ "celeb" ],
    1409: [ "lm" ],
    347: [ "temp" ],
    339: [ "sam" ],
    384: [ "tc" ],
    2216: [ "ench" ],
    1260: [ "ph" ],
    3891: [ "peng", "pengu", "pengi" ],
    15680: [ "mech" ],
    1758: [ "tree" ],
    351: [ "virg" ],
    183: [ "bs" ],
    167: [ "orc" ],
    6422: [ "psy" ],
    2129: [ "ang" ],
    160: [ "lk" ],
    2845: [ "km" ],
    169: [ "gs" ],
    8538: [ "tink" ],
    138: [ "cult" ],
    1650: [ "thulu" ],
    15734: [ "borg" ],
    2696: [ "cm" ],
    154: [ "vivor" ],
    8036: [ "mt" ],
    174: [ "ww" ],
    158: [ "amn" ],
    1368: [ "anarch" ],
    1682: [ "cg" ],
    161: [ "poli" ],
    3564: [ "illu" ],
    2292: [ "sab" ],
    143: [ "yak" ],
    144: [ "gf" ],
    147: [ "guiser" ],
    429: [ "act" ],
    148: [ "jan" ],
    15557: [ "pros" ],
    15700: [ "fili" ],
    789: [ "gator" ],
    150: [ "law" ],
    162: [ "ceptor" ],
    15683: [ "hb" ],
    170: [ "vent" ],
    15646: [ "diab" ],
    1207: [ "vood" ],
    2590: [ "para" ],
    1250: [ "pap" ],
    6115: [ "asso" ],
    1219: [ "fab" ],
    925: [ "lk" ],
    8475: [ "arson" ],
    15952: [ "dusa" ],
    386: [ "terro"],
    1037: [ "mm" ]
};
var exceptions = [
    119,
    4182,
    249
]; //The official names of these roles won't be linked.
var intervalID; //the ID of the 2 second interval

(function() {
    'use strict';
    $.get("https://epicmafia.com/role/suggested?display=grid&page=1&sortby=votes&type=all", function(data) {
        console.log(role_data);
        roles = data.data;
        roleDescriptor();
        intervalID = window.setInterval(roleDescriptor,2000); //iterate every 2 seconds
    });
})();

function roleDescriptor() {
    try {
        document.querySelectorAll(".msg:not(.quote), .log").forEach(function(p) {
            if(!p.emrd) {
                var message = p.innerHTML;
                var tokens = message.split(/[ /[.,\/#!$%\^&\*;:{}=\-_`~()\]?]/).filter(c => c.length > 0);
                var delims = message.split(/[^ /[.,\/#!$%\^&\*;:{}=\-_`~()\]?]/).filter(c => c.length > 0);
                if(/[ /[.,\/#!$%\^&\*;:{}=\-_`~()\]?]/.test(message[0])) tokens = [""].concat(tokens);
                delims[delims.length] = "";
                //console.log(message);
                //console.log(tokens);
                //console.log(delims);
                var rebuiltStr = "";
                var i = 0;
                tokens.forEach(function(token) {
                    var ltoken = token.toLowerCase();
                    var tag = null;
                    roles.forEach(function(role) {
                        if(role.roleid === ltoken && exceptions.indexOf(role.id) == -1) {
                            tag = role.id;
                        }
                        if(aliases[role.id]) aliases[role.id].forEach(function(alias) {
                            if(alias === ltoken) {
                                tag = role.id;
                            }
                        });
                    });
                    if(tag) {
                        rebuiltStr += "<span class=\"rolecont toggleroles tt \" data-rid="+tag+" data-type=\"roleinfo\"><a href=\"https://epicmafia.com/role/"+tag+"\" target=\"_blank\">"+tokens[i]+"</a></span>"+delims[i];
                    } else {
                        rebuiltStr += token+delims[i];
                    }
                    i++;
                });
                p.innerHTML = rebuiltStr;
                p.emrd = true;
            }
        });
    }
    catch(e) {
        alert(e);
        clearInterval(intervalID);
    }
}