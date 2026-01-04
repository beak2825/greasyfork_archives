// ==UserScript==
// @name         Деплой до откат
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Деплойва танкове до откат
// @author       Nikolai Tsvetkov
// @match        https://www.erepublik.com/*/military/battlefield/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/400946/%D0%94%D0%B5%D0%BF%D0%BB%D0%BE%D0%B9%20%D0%B4%D0%BE%20%D0%BE%D1%82%D0%BA%D0%B0%D1%82.user.js
// @updateURL https://update.greasyfork.org/scripts/400946/%D0%94%D0%B5%D0%BF%D0%BB%D0%BE%D0%B9%20%D0%B4%D0%BE%20%D0%BE%D1%82%D0%BA%D0%B0%D1%82.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var $ = jQuery;

    var prevTitle = "";
    var ref = 0;
    var battleData = {"id": SERVER_DATA.battleId, "div": SERVER_DATA.battleZoneId};
    var activeBattle = localStorage.battleId;
    var activeDiv = localStorage.battleZoneId;
    var state = localStorage.state;
    var starpos = $("#special_items_list");
    $(starpos).after('<div id="darko_onoff" style="float:right; cursor:pointer; padding:3px 5px; color:#FFF; background:rgb(33, 33, 33); border-radius:3px; font-size:17px;">Deploy OFF</div>');
    $("#darko_onoff").click(function () {
        var started = $(this).data('started');
        $(this).data('started', !started);
        if (!started) {
            $(this).data('started', true).html("Deploy ON");
            localStorage.battleId = battleData.id;
            localStorage.battleZoneId = battleData.div;
            localStorage.state = 1;
            deploy();
        }
        else {
            $(this).data('started', false).html("Deploy OFF");
            localStorage.battleId = battleData.id;
            localStorage.battleZoneId = battleData.div;
            localStorage.state = 0;
            clearInterval(ref);
        }
    });
    if (localStorage.battleId == battleData.id && localStorage.battleZoneId == battleData.div && localStorage.state == 1) {
        $("#darko_onoff").click();
    }

    function deploy() {
        setTimeout(function() {
            $('button[title="Deploy"]').click()
            setTimeout(function() {
                $('img[alt="Weapon Q7"]').click();
                //$('img[alt="Bazooka"]').click();
                setTimeout(function() {
                    $("button:contains('Max')").click();
                    setTimeout(function() {
                        $('button[title="Start Deploy"]').click();
                        ref = setInterval(function () {
                            var title = $(".deployPanel > button").attr("title");
                            if (prevTitle == title) {
                                location.reload();
                            }
                            prevTitle = title;
                            if ($('#deployReportPopup:visible').length > 0) {
                                $("a[original-title='Continue']").click().click();
                                deploy();
                            }
                        }, 10e3);
                    }, 0.5e3);
                }, 0.5e3);
            }, 0.5e3);
        }, 0.5e3);
    }
//    deploy();
})();