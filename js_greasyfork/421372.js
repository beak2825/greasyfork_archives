// ==UserScript==
// @name         Romher na Raziu
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://*.margonem.pl/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421372/Romher%20na%20Raziu.user.js
// @updateURL https://update.greasyfork.org/scripts/421372/Romher%20na%20Raziu.meta.js
// ==/UserScript==

function npc() {
        if (map.name == 'Stare Wyrobisko p.3') {
                newNpc({
                        "1000200" : {
                                "nick" : "Rohmer Pies",
                                "icon" : "/woj/ith-mur-pijak2.gif",
                                "qm" : 0,
                                "x" : 5,
                                "y" : 6,
                                "lvl" : 60,
                                "type" : 1,
                        }
                });
                            g.npc[1000200].type = 0;
                $("#npc1000200").click(function () {
                        g.lock.add('mydialog');
                        $('#dlgin .message').html('<h4><b>Rohmer Pies');
                        $('#dlgin .replies').html('<li id="dialogbeer2him" class="icon icon LINE_OPTION" onclick=""><div class="icon icon LINE_OPTION"></div>Co tam Rohmer?</li><li class="icon icon LINE_EXIT" onclick="g.lock.remove(\'mydialog\');$(\'#dialog\').hide();map.resizeView();"><div class="icon icon LINE_EXIT"></div>Odchodzę.</li></div>');
                        $("#dialogbeer2him").click(function () {
                                $("#dlgin .message").html('<h4><b>Rohmer Pies</b></h4>Ile tu psów');
                                $("#dlgin .replies").html('<li class="icon icon LINE_EXIT" onclick="g.lock.remove(\'mydialog\');$(\'#dialog\').hide();map.resizeView();"><div class="icon icon LINE_EXIT"></div>Odchodzę.</li></div>');
                        });
                        $('#dialog').show();
                        map.resizeView(512, 192)
                });

        }
}

g.loadQueue.push({
        fun : npc,
        data : ''
});