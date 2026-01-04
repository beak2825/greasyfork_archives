// ==UserScript==
// @name          fokse's BRM
// @author        Fokse
// @description   BRM Ai
// @namespace     BRMManager
// @include https://forums.d2jsp.org/forum.php?f=104
// @include https://forums.d2jsp.org/forum.php?f=104#
// @require https://code.jquery.com/jquery-latest.js
// @version 1.70

// @downloadURL https://update.greasyfork.org/scripts/390190/fokse%27s%20BRM.user.js
// @updateURL https://update.greasyfork.org/scripts/390190/fokse%27s%20BRM.meta.js
// ==/UserScript==
(function() {
    'use strict';
    const   fgsPercent = 0.06,
            game = ['Ai Ww Ft1', 'Ai Ww Ft2', 'Ai Lw Ft1', 'Ai Lw Ft2', 'Hr', 'Lr'],
            gold = round5(parseInt(($('body > div.bar > ul.barR > li:nth-child(2) > a  b').text().replace(",", "") * fgsPercent)));

    function round5(x) {
        return Math.ceil(x / 5) * 5;
    }

    function createThread(topic, desc, message) {
        $.get(`https://forums.d2jsp.org/post.php?f=104`, function(data) {
            var k = data.match(/name="k" value="([a-z0-9]+)"/);
            if (k.length == 2 && k[1]) {
                $.post('https://forums.d2jsp.org/post.php', {
                    p: '',
                    f: 104,
                    t: '',
                    k: k[1],
                    c: 1,
                    ttitle: topic,
                    tdesc: desc,
                    Post: message
                }).done(function(data) {
                    console.log(data)
                    if (~data.indexOf('<title>d2jsp Forums - Invalid Action</title>')) {
                        alert("Impossible to send the message")
                    } else {
                        alert("Message posted :-)")
                    }
                });
            }

        });
    }
    $('body > div:nth-child(4) > div.fR.ab').append('<div class="fR ab"> <a href="#" id="BRM" style=" margin-left: 10px;background: #24a223;">BRM</a></div> ')
    $('#BRM').click(function() {

        if (confirm(`Creating Game for ${gold} FGS?`)) {
            createThread(`${gold} Fgs ${game[Math.floor(Math.random() * game.length)]}`, `Let's fight`, `[b]Go :D[/b]`)
        }
    });
})();