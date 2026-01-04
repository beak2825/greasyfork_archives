// ==UserScript==
// @name         Solving maths is fun
// @description  Solves fun math
// @author       Ko
// @version      1.2
// @include      *.koalabeast.com:*
// @include      *.jukejuice.com:*
// @include      *.newcompte.fr:*
// @include      *.koalabeast.com/game
// @include      *.jukejuice.com/game
// @include      *.newcompte.fr/game
// @icon         https://raw.githubusercontent.com/wilcooo/TagPro-ScriptResources/master/maths.png
// @supportURL   https://www.reddit.com/message/compose/?to=Wilcooo
// @license      MIT
// @namespace https://greasyfork.org/users/152992
// @downloadURL https://update.greasyfork.org/scripts/369464/Solving%20maths%20is%20fun.user.js
// @updateURL https://update.greasyfork.org/scripts/369464/Solving%20maths%20is%20fun.meta.js
// ==/UserScript==


tagpro.ready(function() {

    var names = [];

    tagpro.socket.on('p', function(p) {

        for (var pu of (p.u || p)) {

            if (pu.name != names[pu.id]) {
                names[pu.id] = pu.name;

                if (pu.name && isNaN(pu.name) && pu.name.match(/^[ \d×÷=/*+-]+$/)) {
                    try {
                        var answer = eval(pu.name.replace('×','*').replace('÷','/').replace('=',''));
                        setTimeout(tagpro.socket.emit,
                                   500 + Math.random()*1000,
                                   'chat', {message:String(answer)});
                    } catch(e){}
                }
            }
        }
    });
});
